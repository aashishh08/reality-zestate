import { Developer, Property, Location, Category, Tag } from '../../../models/index.js';
import { LOCATION_BASE_ATTRIBUTES } from '../../../constants/locationAttributes.js';
import { Op } from 'sequelize';

const locationInclude = { model: Location, attributes: LOCATION_BASE_ATTRIBUTES };

function normalizeOptionalSeoString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

class DeveloperService {
  async getDeveloperById(id) {
    const developer = await Developer.findByPk(id);

    if (!developer) {
      throw {
        status: 404,
        message: 'Developer not found',
      };
    }

    return developer;
  }

  async getDeveloperBySlug(slug) {
    const developer = await Developer.findOne({ where: { slug } });

    if (!developer) {
      throw {
        status: 404,
        message: 'Developer not found',
      };
    }

    return developer;
  }

  async listDevelopers(limit = 10, offset = 0, slug = null) {
    const where = {};
    if (slug) where.slug = slug;

    const { count, rows } = await Developer.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['name', 'ASC']],
    });

    return {
      total: count,
      developers: rows,
    };
  }

  async listAdminDevelopers() {
    const developers = await Developer.findAll({
      order: [['name', 'ASC']],
    });

    const counts = await Property.findAll({
      attributes: [
        'developerSlug',
        [Property.sequelize.fn('COUNT', Property.sequelize.col('id')), 'propertyCount'],
      ],
      where: { isPublished: true, developerSlug: { [Op.ne]: null } },
      group: ['developerSlug'],
      raw: true,
    });

    const countBySlug = new Map(
      counts.map((row) => [row.developerSlug, parseInt(row.propertyCount, 10) || 0]),
    );

    return developers.map((developer) => ({
      ...developer.toJSON(),
      propertyCount: countBySlug.get(developer.slug) ?? 0,
    }));
  }

  async updateDeveloper(id, { seoTitle, metaDescription, heroImageUrl }) {
    const developer = await Developer.findByPk(id);
    if (!developer) {
      throw { status: 404, message: 'Developer not found' };
    }

    const updates = {};
    const title = normalizeOptionalSeoString(seoTitle);
    const description = normalizeOptionalSeoString(metaDescription);
    const heroImage = normalizeOptionalSeoString(heroImageUrl);

    if (title !== undefined) updates.seoTitle = title;
    if (description !== undefined) updates.metaDescription = description;
    if (heroImage !== undefined) {
      if (heroImage && !/^https?:\/\//i.test(heroImage)) {
        throw { status: 400, message: 'heroImageUrl must be a valid http(s) URL' };
      }
      updates.heroImageUrl = heroImage;
    }

    if (!Object.keys(updates).length) {
      throw { status: 400, message: 'No valid fields to update' };
    }

    await developer.update(updates);
    return developer;
  }

  async getPropertiesByDeveloper(developerId, filters = {}) {
    const { limit = 10, offset = 0 } = filters;

    const developer = await Developer.findByPk(developerId);
    if (!developer) {
      throw {
        status: 404,
        message: 'Developer not found',
      };
    }

    const { count, rows } = await Property.findAndCountAll({
      where: { developerId },
      include: [
        { model: Developer },
        locationInclude,
        { model: Category, as: 'Categories', through: { attributes: [] } },
        { model: Tag, as: 'Tags', through: { attributes: [] } },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['createdAt', 'DESC']],
      distinct: true,
    });

    return {
      developer,
      total: count,
      properties: rows,
    };
  }
}

export default new DeveloperService();
