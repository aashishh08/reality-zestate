import { Op } from 'sequelize';
import { Blog } from '../../../models/index.js';

/**
 * Strips HTML document wrappers (<html>, <head>, <body>) from blog content.
 * Blogs from AI generators (Genspark, etc.) arrive as full documents.
 * Storing wrapped content causes DOM corruption on SSR page renders.
 */
export function stripHtmlDocumentWrapper(content) {
  if (!content || typeof content !== 'string') return content;
  let result = content;

  // Extract body content if full document
  const bodyMatch = result.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();

  // No <body> but has document wrapper tags — strip them
  result = result.replace(/<!DOCTYPE[^>]*>/gi, '');
  result = result.replace(/<html[^>]*>/gi, '').replace(/<\/html>/gi, '');
  const headOpen = result.toLowerCase().indexOf('<head');
  if (headOpen !== -1) {
    const headClose = result.toLowerCase().indexOf('</head>');
    if (headClose !== -1) result = result.slice(0, headOpen) + result.slice(headClose + 7);
  }
  return result.trim();
}

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
