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
    const { type } = req.query;

    const locations = await locationService.listLocations(type);

    res.json({
      success: true,
      data: locations,
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
