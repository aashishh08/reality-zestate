import { Op } from 'sequelize';
import { Property, Developer, Location, Category, PropertySection } from '../../../models/index.js';

class PropertyService {
  async createProperty(data) {
    const property = await Property.create(data);
    return property;
  }

  async updateProperty(id, data) {
    const property = await Property.findByPk(id);

    if (!property) {
      throw {
        status: 404,
        message: 'Property not found',
      };
    }

    await property.update(data);

    return property;
  }

  async deleteProperty(id) {
    const property = await Property.findByPk(id);

    if (!property) {
      throw {
        status: 404,
        message: 'Property not found',
      };
    }

    // PropertySection will CASCADE delete automatically via DB constraint
    // Leads will be SET NULL automatically via DB constraint
    await property.destroy();

    return true;
  }

  async getPropertyBySlug(slug) {
    const property = await Property.findOne({
      where: { slug },
      include: [
        { model: Developer },
        { model: Location },
        { model: PropertySection, order: [['order', 'ASC']] },
        { model: Category },
      ],
    });

    if (!property) {
      throw {
        status: 404,
        message: 'Property not found',
      };
    }

    return property;
  }

  async listProperties(filters = {}) {
    const {
      propertyType,
      locationId,
      developerId,
      categoryIds,
      priceMin,
      priceMax,
      isPublished,
      limit = 10,
      offset = 0,
    } = filters;

    const where = {};
    const include = [
      { model: Developer },
      { model: Location },
    ];

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (locationId) {
      where.locationId = locationId;
    }

    if (developerId) {
      where.developerId = developerId;
    }

    if (priceMin || priceMax) {
      where.priceMin = {};
      if (priceMin) {
        where.priceMin[Op.gte] = priceMin;
      }
      if (priceMax) {
        where.priceMax = where.priceMax || {};
        where.priceMax[Op.lte] = priceMax;
      }
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    // Handle category filtering
    if (categoryIds && categoryIds.length > 0) {
      include.push({
        model: Category,
        where: { id: { [Op.in]: categoryIds } },
        through: { attributes: [] },
      });
    } else {
      include.push({
        model: Category,
        through: { attributes: [] },
      });
    }

    const { count, rows } = await Property.findAndCountAll({
      where,
      include,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['createdAt', 'DESC']],
      distinct: true,
    });

    return {
      total: count,
      properties: rows,
    };
  }

  async createPropertySections(propertyId, sections) {
    // Verify property exists
    const property = await Property.findByPk(propertyId);

    if (!property) {
      throw {
        status: 404,
        message: 'Property not found',
      };
    }

    // Validate sections array
    if (!Array.isArray(sections) || sections.length === 0) {
      throw {
        status: 400,
        message: 'Sections must be a non-empty array',
      };
    }

    // Validate each section has required fields
    for (const section of sections) {
      if (!section.type || !section.title || section.data === undefined) {
        throw {
          status: 400,
          message: 'Each section must have type, title, and data fields',
        };
      }
    }

    // Prepare sections with propertyId
    const sectionsToCreate = sections.map((section, index) => ({
      propertyId,
      type: section.type,
      title: section.title,
      order: section.order || index,
      isVisible: section.isVisible !== undefined ? section.isVisible : true,
      data: section.data,
    }));

    // Bulk create sections
    const createdSections = await PropertySection.bulkCreate(sectionsToCreate);

    return createdSections;
  }

  async updatePropertySections(propertyId, sections) {
    // Verify property exists
    const property = await Property.findByPk(propertyId);

    if (!property) {
      throw {
        status: 404,
        message: 'Property not found',
      };
    }

    // Delete existing sections for this property
    await PropertySection.destroy({
      where: { propertyId },
    });

    // Create new sections
    const sectionsToCreate = sections.map((section, index) => ({
      propertyId,
      type: section.type,
      title: section.title,
      order: section.order || index,
      isVisible: section.isVisible !== undefined ? section.isVisible : true,
      data: section.data,
    }));

    const createdSections = await PropertySection.bulkCreate(sectionsToCreate);

    return createdSections;
  }
}

export default new PropertyService();
