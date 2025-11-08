import { db } from '../config/db.config';
import { blogs } from '../models/blog.model';
import { eq, and } from 'drizzle-orm';
import { CreateBlogInput, UpdateBlogInput } from '../utils/validation';
import { AppError } from '../middleware/error.middleware';

export class BlogService {
  async createBlog(userId: string, data: CreateBlogInput) {
    const [blog] = await db
      .insert(blogs)
      .values({
        ...data,
        authorId: userId,
      })
      .returning();

    return blog;
  }

  async getBlogs(userId: string) {
    const userBlogs = await db
      .select()
      .from(blogs)
      .where(eq(blogs.authorId, userId));

    return userBlogs;
  }

  async getBlogById(userId: string, blogId: string) {
    const [blog] = await db
      .select()
      .from(blogs)
      .where(and(eq(blogs.id, blogId), eq(blogs.authorId, userId)));

    if (!blog) {
      throw new AppError(404, 'Blog not found');
    }

    return blog;
  }

  async updateBlog(userId: string, blogId: string, data: UpdateBlogInput) {
    const [blog] = await db
      .update(blogs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(blogs.id, blogId), eq(blogs.authorId, userId)))
      .returning();

    if (!blog) {
      throw new AppError(404, 'Blog not found');
    }

    return blog;
  }

  async deleteBlog(userId: string, blogId: string) {
    const [blog] = await db
      .delete(blogs)
      .where(and(eq(blogs.id, blogId), eq(blogs.authorId, userId)))
      .returning();

    if (!blog) {
      throw new AppError(404, 'Blog not found');
    }

    return { message: 'Blog deleted successfully' };
  }
}