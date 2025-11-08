import { Response, NextFunction } from 'express';
import { BlogService } from '../services/blog.service';
import {
  createBlogSchema,
  updateBlogSchema,
  blogIdSchema,
} from '../utils/validation';
import { AuthRequest } from '../middleware/auth.middleware';

const blogService = new BlogService();

export class BlogController {
  async createBlog(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createBlogSchema.parse(req.body);
      const blog = await blogService.createBlog(req.userId!, validatedData);

      return res.status(201).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBlogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const blogs = await blogService.getBlogs(req.userId!);

      return res.status(200).json({
        success: true,
        data: blogs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBlog(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = blogIdSchema.parse(req.params);
      const blog = await blogService.getBlogById(req.userId!, id);

      return res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBlog(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = blogIdSchema.parse(req.params);
      const validatedData = updateBlogSchema.parse(req.body);
      const blog = await blogService.updateBlog(
        req.userId!,
        id,
        validatedData
      );

      return res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = blogIdSchema.parse(req.params);
      const result = await blogService.deleteBlog(req.userId!, id);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}