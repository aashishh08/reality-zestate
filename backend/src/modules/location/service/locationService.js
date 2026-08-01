import { Op } from 'sequelize';
import { Location, Property, Developer, Category, Tag } from '../../../models/index.js';
import geographyService from './geographyService.js';
import {
  LOCATION_BASE_ATTRIBUTES,
  LOCATION_ADMIN_ATTRIBUTES,
  LOCATION_PARENT_ATTRIBUTES,
} from '../../../constants/locationAttributes.js';

const locationInclude = { model: Location, attributes: LOCATION_BASE_ATTRIBUTES };

class LocationService {
  async getLocationById(id) {
    const location = await Location.findByPk(id, {
      attributes: LOCATION_BASE_ATTRIBUTES,
      include: [
        {
          model: Location,
          as: 'children',
          attributes: LOCATION_BASE_ATTRIBUTES,
          include: [{ model: Location, as: 'children', attributes: LOCATION_BASE_ATTRIBUTES }],
        },
        {
          model: Location,
          as: 'parent',
          attributes: LOCATION_PARENT_ATTRIBUTES,
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

  async listLocations(filters = {}) {
    const { type, slug, parentId } = filters;
    const where = {};

    if (type) where.type = type;
    if (slug) where.slug = slug;
    if (parentId) where.parentId = parentId;

    const treeIncludes = [
      {
        model: Location,
        as: 'children',
        attributes: LOCATION_BASE_ATTRIBUTES,
        include: [{ model: Location, as: 'children', attributes: LOCATION_BASE_ATTRIBUTES }],
      },
    ];

    const localityIncludes = [
      {
        model: Location,
        as: 'parent',
        attributes: LOCATION_PARENT_ATTRIBUTES,
      },
    ];

    const locations = await Location.findAll({
      where,
      attributes: LOCATION_BASE_ATTRIBUTES,
      include: type === 'locality' ? localityIncludes : treeIncludes,
      order: [['name', 'ASC']],
    });

    return locations;
  }

  async listAdminLocations() {
    const cities = await Location.findAll({
      where: { type: 'city' },
      attributes: LOCATION_BASE_ATTRIBUTES,
      order: [['name', 'ASC']],
    });

    let localities;
    try {
      localities = await Location.findAll({
        where: { type: 'locality' },
        attributes: LOCATION_ADMIN_ATTRIBUTES,
        include: [{
          model: Location,
          as: 'parent',
          attributes: LOCATION_PARENT_ATTRIBUTES,
        }],
        order: [['name', 'ASC']],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes('isFeatured') && !message.includes('featuredOrder')) {
        throw error;
      }
      localities = await Location.findAll({
        where: { type: 'locality' },
        attributes: LOCATION_BASE_ATTRIBUTES,
        include: [{
          model: Location,
          as: 'parent',
          attributes: LOCATION_PARENT_ATTRIBUTES,
        }],
        order: [['name', 'ASC']],
      });
    }

    return Promise.all(cities.map(async (city) => {
      const cityChildren = localities.filter((loc) => loc.parentId === city.id);

      return {
        ...city.toJSON(),
        propertyCount: await geographyService.countPropertyReferences(city),
        children: await Promise.all(cityChildren.map(async (locality) => ({
          ...locality.toJSON(),
          isFeatured: locality.isFeatured ?? false,
          featuredOrder: locality.featuredOrder ?? null,
          propertyCount: await geographyService.countPropertyReferences(locality),
        }))),
      };
    }));
  }

  async createCity({ name, slug }) {
    if (!name?.trim() || !slug?.trim()) {
      throw { status: 400, message: 'Name and slug are required' };
    }

    const normalizedSlug = slug.trim().toLowerCase();
    if (await geographyService.isSlugTaken(normalizedSlug)) {
      throw { status: 409, message: `Slug "${normalizedSlug}" is already in use` };
    }

    return Location.create({
      name: name.trim(),
      slug: normalizedSlug,
      type: 'city',
      parentId: null,
    });
  }

  async createLocality({ name, slug, parentId }) {
    if (!name?.trim() || !slug?.trim() || !parentId) {
      throw { status: 400, message: 'Name, slug, and parent city are required' };
    }

    await geographyService.getCityById(parentId);

    const normalizedSlug = slug.trim().toLowerCase();
    if (await geographyService.isSlugTaken(normalizedSlug)) {
      throw { status: 409, message: `Slug "${normalizedSlug}" is already in use` };
    }

    return Location.create({
      name: name.trim(),
      slug: normalizedSlug,
      type: 'locality',
      parentId,
    });
  }

  async updateLocation(id, { name, parentId, isFeatured, featuredOrder }) {
    const location = await Location.findByPk(id);
    if (!location) {
      throw { status: 404, message: 'Location not found' };
    }

    if (!name?.trim()) {
      throw { status: 400, message: 'Name is required' };
    }

    const updates = { name: name.trim() };

    if (location.type === 'locality' && parentId && parentId !== location.parentId) {
      const propertyCount = await geographyService.countPropertyReferences(location);
      if (propertyCount > 0) {
        throw {
          status: 400,
          message: 'Cannot change parent city — properties reference this locality',
        };
      }
      await geographyService.getCityById(parentId);
      updates.parentId = parentId;
    }

    if (location.type === 'locality') {
      if (isFeatured !== undefined) {
        updates.isFeatured = Boolean(isFeatured);
      }
      if (featuredOrder !== undefined) {
        updates.featuredOrder = featuredOrder === null || featuredOrder === ''
          ? null
          : parseInt(featuredOrder, 10);
      }
    }

    await location.update(updates);

    if (location.type === 'locality') {
      return geographyService.getLocalityById(id);
    }

    return location;
  }

  async getPropertiesByLocation(locationId, filters = {}) {
    const { limit = 10, offset = 0 } = filters;

    const location = await Location.findByPk(locationId, {
      attributes: LOCATION_BASE_ATTRIBUTES,
    });
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
      location,
      total: count,
      properties: rows,
    };
  }
}

export default new LocationService();
