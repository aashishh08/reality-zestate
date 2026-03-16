import { Developer, Property, Location, Category, Tag } from '../../../models/index.js';

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

  async listDevelopers(limit = 10, offset = 0) {
    const { count, rows } = await Developer.findAndCountAll({
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
        { model: Location },
        { model: Category, through: { attributes: [] } },
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
