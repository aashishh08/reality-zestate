import { Category, Property, Developer, Location, Tag } from '../../../models/index.js';

class CategoryService {
  async getCategoryById(id) {
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'children',
          include: [{ model: Category, as: 'children' }],
        },
        {
          model: Category,
          as: 'parent',
        },
      ],
    });

    if (!category) {
      throw {
        status: 404,
        message: 'Category not found',
      };
    }

    return category;
  }

  async listCategories(propertyType = null) {
    const where = {};
    if (propertyType) {
      where.propertyType = propertyType;
    }

    const categories = await Category.findAll({
      where,
      include: [
        {
          model: Category,
          as: 'children',
          include: [{ model: Category, as: 'children' }],
        },
      ],
      order: [['name', 'ASC']],
    });

    return categories;
  }

  async getPropertiesByCategory(categoryId, filters = {}) {
    const { limit = 10, offset = 0 } = filters;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw {
        status: 404,
        message: 'Category not found',
      };
    }

    const { count, rows } = await Property.findAndCountAll({
      include: [
        { model: Developer },
        { model: Location },
        {
          model: Category,
          where: { id: categoryId },
          through: { attributes: [] },
        },
        { model: Tag, as: 'Tags', through: { attributes: [] } },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['createdAt', 'DESC']],
      distinct: true,
    });

    return {
      category,
      total: count,
      properties: rows,
    };
  }
}

export default new CategoryService();
