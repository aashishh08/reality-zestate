import locationService from '../service/locationService.js';

class LocationController {
  async getLocationById(req, res) {
    const { id } = req.params;

    const location = await locationService.getLocationById(id);

    res.json({
      success: true,
      data: location,
    });
  }

  async listLocations(req, res) {
    const { type, slug, parentId } = req.query;

    const locations = await locationService.listLocations({ type, slug, parentId });

    res.json({
      success: true,
      data: locations,
    });
  }

  async listAdminLocations(req, res) {
    const locations = await locationService.listAdminLocations();

    res.json({
      success: true,
      data: locations,
    });
  }

  async createCity(req, res) {
    const city = await locationService.createCity(req.body);

    res.status(201).json({
      success: true,
      data: city,
      message: 'City created successfully',
    });
  }

  async createLocality(req, res) {
    const locality = await locationService.createLocality(req.body);

    res.status(201).json({
      success: true,
      data: locality,
      message: 'Locality created successfully',
    });
  }

  async updateLocation(req, res) {
    const { id } = req.params;
    const location = await locationService.updateLocation(id, req.body);

    res.json({
      success: true,
      data: location,
      message: 'Location updated successfully',
    });
  }

  async getPropertiesByLocation(req, res) {
    const { id } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const result = await locationService.getPropertiesByLocation(id, {
      limit,
      offset,
    });

    res.json({
      success: true,
      data: result.properties,
      location: result.location,
      pagination: {
        total: result.total,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  }
}

export default new LocationController();
