import propertyService from '../service/propertyService.js';

class PropertyController {
  async createProperty(req, res) {
    const { slug, title, propertyType, developerId, locationId, status, priceMin, priceMax, isPublished } = req.body;

    if (!slug || !title || !propertyType || !developerId || !locationId) {
      throw {
        status: 400,
        message: 'Missing required fields: slug, title, propertyType, developerId, locationId',
      };
    }

    const property = await propertyService.createProperty({
      slug,
      title,
      propertyType,
      developerId,
      locationId,
      status,
      priceMin,
      priceMax,
      isPublished,
    });

    res.status(201).json({
      success: true,
      data: property,
      message: 'Property created successfully',
    });
  }

  async updateProperty(req, res) {
    const { id } = req.params;
    const { slug, title, propertyType, developerId, locationId, status, priceMin, priceMax, isPublished } = req.body;

    const property = await propertyService.updateProperty(id, {
      slug,
      title,
      propertyType,
      developerId,
      locationId,
      status,
      priceMin,
      priceMax,
      isPublished,
    });

    res.json({
      success: true,
      data: property,
      message: 'Property updated successfully',
    });
  }

  async deleteProperty(req, res) {
    const { id } = req.params;

    await propertyService.deleteProperty(id);

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  }

  async getPropertyBySlug(req, res) {
    const { slug } = req.params;

    const property = await propertyService.getPropertyBySlug(slug);

    res.json({
      success: true,
      data: property,
    });
  }

  async listProperties(req, res) {
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
    } = req.query;

    const filters = {
      propertyType,
      locationId,
      developerId,
      categoryIds: categoryIds ? (typeof categoryIds === 'string' ? [categoryIds] : categoryIds) : undefined,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      isPublished: isPublished ? isPublished === 'true' : undefined,
      limit,
      offset,
    };

    const result = await propertyService.listProperties(filters);

    res.json({
      success: true,
      data: result.properties,
      pagination: {
        total: result.total,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  }

  async createPropertySections(req, res) {
    const { id } = req.params;
    const { sections } = req.body;

    if (!sections) {
      throw {
        status: 400,
        message: 'Sections array is required',
      };
    }

    const createdSections = await propertyService.createPropertySections(id, sections);

    res.status(201).json({
      success: true,
      data: createdSections,
      message: 'Property sections created successfully',
    });
  }

  async updatePropertySections(req, res) {
    const { id } = req.params;
    const { sections } = req.body;

    if (!sections) {
      throw {
        status: 400,
        message: 'Sections array is required',
      };
    }

    const updatedSections = await propertyService.updatePropertySections(id, sections);

    res.json({
      success: true,
      data: updatedSections,
      message: 'Property sections updated successfully',
    });
  }
}

export default new PropertyController();
