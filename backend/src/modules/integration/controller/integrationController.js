import integrationService from '../service/integrationService.js';

class IntegrationController {
  async createPropertyFromCRM(req, res) {
    const { slug, title, propertyType, developerId, locationId, status, priceMin, priceMax, isPublished, sections } = req.body;

    if (!slug || !title || !propertyType || !developerId || !locationId) {
      throw {
        status: 400,
        message: 'Missing required fields: slug, title, propertyType, developerId, locationId',
      };
    }

    const property = await integrationService.createPropertyFromCRM({
      slug,
      title,
      propertyType,
      developerId,
      locationId,
      status,
      priceMin,
      priceMax,
      isPublished,
      sections,
    });

    res.status(201).json({
      success: true,
      data: property,
      message: 'Property created from CRM successfully',
    });
  }

  async updatePropertyFromCRM(req, res) {
    const { id } = req.params;
    const { slug, title, propertyType, developerId, locationId, status, priceMin, priceMax, isPublished, sections } = req.body;

    const property = await integrationService.updatePropertyFromCRM(id, {
      slug,
      title,
      propertyType,
      developerId,
      locationId,
      status,
      priceMin,
      priceMax,
      isPublished,
      sections,
    });

    res.json({
      success: true,
      data: property,
      message: 'Property updated from CRM successfully',
    });
  }

  async pushPropertySections(req, res) {
    const { propertyId } = req.params;
    const { sections } = req.body;

    if (!sections) {
      throw {
        status: 400,
        message: 'Sections array is required',
      };
    }

    const property = await integrationService.pushPropertySections(propertyId, sections);

    res.json({
      success: true,
      data: property,
      message: 'Property sections pushed successfully',
    });
  }
}

export default new IntegrationController();
