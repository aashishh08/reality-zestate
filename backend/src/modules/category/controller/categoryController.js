import categoryService from '../service/categoryService.js';

class CategoryController {
  async getCategoryById(req, res) {
    const { id } = req.params;

    const category = await categoryService.getCategoryById(id);

    res.json({
      success: true,
      data: category,
    });
  }

  async listCategories(req, res) {
    const { propertyType } = req.query;

    const categories = await categoryService.listCategories(propertyType);

    res.json({
      success: true,
      data: categories,
    });
  }

  async getPropertiesByCategory(req, res) {
    const { id } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const result = await categoryService.getPropertiesByCategory(id, {
      limit,
      offset,
    });

    res.json({
      success: true,
      data: result.properties,
      category: result.category,
      pagination: {
        total: result.total,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  }
}

export default new CategoryController();
