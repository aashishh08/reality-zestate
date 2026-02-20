import { Op } from 'sequelize';
import { Blog } from '../../../models/index.js';

class BlogService {
  async createBlog(data) {
    const blog = await Blog.create(data);
    return blog;
  }

  async updateBlog(id, data) {
    const blog = await Blog.findByPk(id);

    if (!blog) {
      throw {
        status: 404,
        message: 'Blog not found',
      };
    }

    await blog.update(data);
    return blog;
  }

  async deleteBlog(id) {
    const blog = await Blog.findByPk(id);

    if (!blog) {
      throw {
        status: 404,
        message: 'Blog not found',
      };
    }

    await blog.destroy();
    return true;
  }

  async getBlogBySlug(slug) {
    const blog = await Blog.findOne({
      where: { slug },
    });

    if (!blog) {
      throw {
        status: 404,
        message: 'Blog not found',
      };
    }

    return blog;
  }

  async getBlogById(id) {
    const blog = await Blog.findByPk(id);

    if (!blog) {
      throw {
        status: 404,
        message: 'Blog not found',
      };
    }

    return blog;
  }

  async listPublishedBlogs(limit = 10, offset = 0) {
    const { count, rows } = await Blog.findAndCountAll({
      where: { isPublished: true },
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['createdAt', 'DESC']],
    });

    return {
      total: count,
      blogs: rows,
    };
  }

  async listAllBlogs(limit = 20, offset = 0, search = '') {
    const where = search ? {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } },
      ],
    } : {};

    const { count, rows } = await Blog.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['createdAt', 'DESC']],
    });

    return {
      total: count,
      blogs: rows,
    };
  }
}

export default new BlogService();
