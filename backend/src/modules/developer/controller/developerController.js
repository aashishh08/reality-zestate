import developerService from '../service/developerService.js';

class DeveloperController {
  async getDeveloperById(req, res) {
    const { id } = req.params;

    const developer = await developerService.getDeveloperById(id);

    res.json({
      success: true,
      data: developer,
    });
  }

  async listDevelopers(req, res) {
    const { limit = 10, offset = 0 } = req.query;

    const result = await developerService.listDevelopers(limit, offset);

    res.json({
      success: true,
      data: result.developers,
      pagination: {
        total: result.total,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  }

  async getPropertiesByDeveloper(req, res) {
    const { id } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const result = await developerService.getPropertiesByDeveloper(id, {
      limit,
      offset,
    });

    res.json({
      success: true,
      data: result.properties,
      developer: result.developer,
      pagination: {
        total: result.total,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  }
}

export default new DeveloperController();
