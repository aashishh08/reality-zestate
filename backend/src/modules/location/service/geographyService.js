import { Op } from 'sequelize';
import { Location, Property } from '../../../models/index.js';

function formatCity(row) {
  return { slug: row.slug, label: row.name };
}

function formatLocality(row) {
  const parent = row.parent;
  return {
    slug: row.slug,
    label: row.name,
    city: parent?.slug ?? null,
  };
}

class GeographyService {
  async getCities() {
    const rows = await Location.findAll({
      where: { type: 'city' },
      order: [['name', 'ASC']],
    });
    return rows.map(formatCity);
  }

  async getLocalities(citySlug = null) {
    const include = [{
      model: Location,
      as: 'parent',
      attributes: ['id', 'name', 'slug', 'type'],
      ...(citySlug ? { where: { slug: citySlug, type: 'city' }, required: true } : {}),
    }];

    const rows = await Location.findAll({
      where: { type: 'locality' },
      include,
      order: [['name', 'ASC']],
    });

    return rows.map(formatLocality);
  }

  async getEnumData(citySlug = null) {
    const cities = await this.getCities();
    const localities = await this.getLocalities(citySlug || null);
    return { cities, localities };
  }

  async validateSlugs({ citySlug, localitySlug } = {}) {
    if (citySlug !== undefined && citySlug !== null && citySlug !== '') {
      const city = await Location.findOne({ where: { slug: citySlug, type: 'city' } });
      if (!city) {
        throw {
          status: 400,
          message: `Unknown city slug: "${citySlug}". See GET /api/enums for valid values.`,
        };
      }
    }

    if (localitySlug !== undefined && localitySlug !== null && localitySlug !== '') {
      const locality = await Location.findOne({
        where: { slug: localitySlug, type: 'locality' },
        include: [{
          model: Location,
          as: 'parent',
          attributes: ['slug', 'type'],
        }],
      });

      if (!locality) {
        throw {
          status: 400,
          message: `Unknown locality slug: "${localitySlug}". See GET /api/enums for valid values.`,
        };
      }

      if (citySlug && locality.parent?.slug !== citySlug) {
        throw {
          status: 400,
          message: `"${localitySlug}" is not a known locality in city "${citySlug}". See GET /api/enums for valid values.`,
        };
      }
    }
  }

  async countPropertyReferences(location) {
    const byLocationId = await Property.count({ where: { locationId: location.id } });

    const bySlug = location.type === 'city'
      ? await Property.count({ where: { citySlug: location.slug } })
      : await Property.count({ where: { localitySlug: location.slug } });

    return byLocationId + bySlug;
  }

  async isSlugTaken(slug, excludeId = null) {
    const where = { slug };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    const existing = await Location.findOne({ where });
    return Boolean(existing);
  }

  async getCityById(id) {
    const city = await Location.findOne({ where: { id, type: 'city' } });
    if (!city) {
      throw { status: 404, message: 'City not found' };
    }
    return city;
  }

  async getLocalityById(id) {
    const locality = await Location.findOne({
      where: { id, type: 'locality' },
      include: [{
        model: Location,
        as: 'parent',
        attributes: ['id', 'name', 'slug', 'type'],
      }],
    });
    if (!locality) {
      throw { status: 404, message: 'Locality not found' };
    }
    return locality;
  }
}

export default new GeographyService();
