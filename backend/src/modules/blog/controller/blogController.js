import blogService from '../service/blogService.js';

class BlogController {
  async createBlog(req, res) {
    const { title, slug, content, isPublished } = req.body;

    if (!title || !slug || !content) {
      throw {
        status: 400,
        message: 'Missing required fields: title, slug, content',
      };
    }

    const blog = await blogService.createBlog({
      title,
      slug,
      content,
      isPublished: isPublished || false,
    });

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog created successfully',
    });
  }

  async updateBlog(req, res) {
    const { id } = req.params;
    const { title, slug, content, isPublished } = req.body;

    const blog = await blogService.updateBlog(id, {
      title,
      slug,
      content,
      isPublished,
    });

    res.json({
      success: true,
      data: blog,
      message: 'Blog updated successfully',
    });
  }

  async deleteBlog(req, res) {
    const { id } = req.params;

    await blogService.deleteBlog(id);

    res.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  }

  async getBlogBySlug(req, res) {
    const { slug } = req.params;

    const blog = await blogService.getBlogBySlug(slug);

    res.json({
      success: true,
      data: blog,
    });
  }

  async listPublishedBlogs(req, res) {
    const { limit = 10, offset = 0 } = req.query;

    const result = await blogService.listPublishedBlogs(limit, offset);

    res.json({
      success: true,
      data: result.blogs,
      pagination: {
        total: result.total,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  }
}

export default new BlogController();
