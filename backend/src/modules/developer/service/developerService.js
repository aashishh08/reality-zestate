import { Developer, Property, Location, Category, Tag } from '../../../models/index.js';
import { LOCATION_BASE_ATTRIBUTES } from '../../../constants/locationAttributes.js';
import { Op } from 'sequelize';

const locationInclude = { model: Location, attributes: LOCATION_BASE_ATTRIBUTES };

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
