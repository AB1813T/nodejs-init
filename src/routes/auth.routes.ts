import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { createDocumentedRouter } from '../utils/documentedRouter';
import { loginSchema } from '../utils/validation';
import { authTokensSchema } from '../schemas/auth.schema';
import { messageSchema, successResponse} from '../schemas/response.schema';

const authController = new AuthController();

const documentedRouter = createDocumentedRouter({
  basePath: '/api/auth',
  defaultTags: ['Auth'],
  secureByDefault: false,
});

documentedRouter.post(
  '/login',
  {
    summary: 'Login user (Local environment only)',
    security: false,
    request: {
      body: {
        schema: loginSchema,
      },
    },
    responses: {
      200: {
        description: 'Login successful',
        schema: successResponse(authTokensSchema),
      },
    },
  },
  authController.login
);

documentedRouter.post(
  '/logout',
  {
    summary: 'Logout user',
    security: true,
    responses: {
      200: {
        description: 'Logout successful',
        schema: successResponse(messageSchema),
      },
    },
  },
  authMiddleware,
  authController.logout
);

export default documentedRouter.router;
