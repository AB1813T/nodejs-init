import { BlogController } from '../controllers/blog.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { createDocumentedRouter } from '../utils/documentedRouter';
import {
  blogIdSchema,
  createBlogSchema,
  updateBlogSchema,
} from '../utils/validation';
import {
  blogListSchema,
  blogSchema,
} from '../schemas/blog.schema';
import { messageSchema, successResponse} from '../schemas/response.schema';

const blogController = new BlogController();

const documentedRouter = createDocumentedRouter({
  basePath: '/api/blogs',
  defaultTags: ['Blogs'],
  secureByDefault: true,
});

const router = documentedRouter.router;
router.use(authMiddleware);

documentedRouter.post(
  '/',
  {
    summary: 'Create a new blog',
    request: {
      body: {
        schema: createBlogSchema,
      },
    },
    responses: {
      201: {
        description: 'Blog created successfully',
        schema: successResponse(blogSchema),
      },
    },
  },
  blogController.createBlog
);

documentedRouter.get(
  '/',
  {
    summary: 'Get all blogs for authenticated user',
    responses: {
      200: {
        description: 'List of blogs',
        schema: successResponse(blogListSchema),
      },
    },
  },
  blogController.getBlogs
);

documentedRouter.get(
  '/:id',
  {
    summary: 'Get a blog by ID',
    request: {
      params: blogIdSchema,
    },
    responses: {
      200: {
        description: 'Blog details',
        schema: successResponse(blogSchema),
      },
    },
  },
  blogController.getBlog
);

documentedRouter.put(
  '/:id',
  {
    summary: 'Update a blog',
    request: {
      params: blogIdSchema,
      body: {
        schema: updateBlogSchema,
      },
    },
    responses: {
      200: {
        description: 'Blog updated successfully',
        schema: successResponse(blogSchema),
      },
    },
  },
  blogController.updateBlog
);

documentedRouter.delete(
  '/:id',
  {
    summary: 'Delete a blog',
    request: {
      params: blogIdSchema,
    },
    responses: {
      200: {
        description: 'Blog deleted successfully',
        schema: successResponse(messageSchema),
      },
    },
  },
  blogController.deleteBlog
);

export default router;
