import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { createDocumentedRouter } from '../utils/documentedRouter';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from '../utils/validation';
import {
  userListSchema,
  userSchema,
} from '../schemas/user.schema';
import { messageSchema, successResponse} from '../schemas/response.schema';

const userController = new UserController();

const documentedRouter = createDocumentedRouter({
  basePath: '/api/users',
  defaultTags: ['Users'],
  secureByDefault: true,
});

const router = documentedRouter.router;
router.use(authMiddleware);

documentedRouter.post(
  '/',
  {
    summary: 'Create a new user',
    request: {
      body: {
        schema: createUserSchema,
      },
    },
    responses: {
      201: {
        description: 'User created successfully',
        schema: successResponse(userSchema),
      },
    },
  },
  userController.createUser
);

documentedRouter.get(
  '/',
  {
    summary: 'Get all users',
    responses: {
      200: {
        description: 'List of users',
        schema: successResponse(userListSchema),
      },
    },
  },
  userController.getUsers
);

documentedRouter.get(
  '/:id',
  {
    summary: 'Get a user by ID',
    request: {
      params: userIdSchema,
    },
    responses: {
      200: {
        description: 'User details',
        schema: successResponse(userSchema),
      },
    },
  },
  userController.getUser
);

documentedRouter.put(
  '/:id',
  {
    summary: 'Update a user',
    request: {
      params: userIdSchema,
      body: {
        schema: updateUserSchema,
      },
    },
    responses: {
      200: {
        description: 'User updated successfully',
        schema: successResponse(userSchema),
      },
    },
  },
  userController.updateUser
);

documentedRouter.delete(
  '/:id',
  {
    summary: 'Delete a user by ID',
    request: {
      params: userIdSchema,
    },
    responses: {
      200: {
        description: 'User deleted successfully',
        schema: successResponse(messageSchema),
      },
    },
  },
  userController.deleteUser
);

export default router;
