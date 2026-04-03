import { Location, Property, Developer, Category, Tag } from '../../../models/index.js';

class LocationService {
  async getLocationById(id) {
    const location = await Location.findByPk(id, {
      include: [
        {
          model: Location,
          as: 'children',
          include: [{ model: Location, as: 'children' }],
        },
        {
          model: Location,
          as: 'parent',
        },
      ],
    });

    if (!location) {
      throw {
        status: 404,
        message: 'Location not found',
      };
    }

    return location;
  }

  async listLocations(type = null, slug = null) {
    const where = {};
    if (type) {
      where.type = type;
    }
    if (slug) {
      where.slug = slug;
    }

    const treeIncludes = [
      {
        model: Location,
        as: 'children',
        include: [{ model: Location, as: 'children' }],
      },
    ];

    const localityIncludes = [
      {
        model: Location,
        as: 'parent',
        attributes: ['id', 'name', 'slug', 'type'],
      },
    ];

    const locations = await Location.findAll({
      where,
      include: type === 'locality' ? localityIncludes : treeIncludes,
      order: [['name', 'ASC']],
    });

    return locations;
  }

  async getPropertiesByLocation(locationId, filters = {}) {
    const { limit = 10, offset = 0 } = filters;

    const location = await Location.findByPk(locationId);
    if (!location) {
      throw {
        status: 404,
        message: 'Location not found',
      };
    }

    const { count, rows } = await Property.findAndCountAll({
      where: { locationId },
      include: [
        { model: Developer },
        { model: Location },
        { model: Category, as: 'Categories', through: { attributes: [] } },
        { model: Tag, as: 'Tags', through: { attributes: [] } },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['createdAt', 'DESC']],
      distinct: true,
    });

    return {
      location,
      total: count,
      properties: rows,
    };
  }
}

export default new LocationService();
