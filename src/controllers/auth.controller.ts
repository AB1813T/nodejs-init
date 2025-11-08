import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { loginSchema } from '../utils/validation';
import { config } from '../config/env.config';
import { AuthRequest } from '../middleware/auth.middleware';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (config.env !== 'local') {
        return res.status(403).json({
          success: false,
          error: 'Login endpoint is only available in local environment',
        });
      }

      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);

      return res.status(200).json({
        success: true,
        data: {
          accessToken: result.session?.access_token,
          refreshToken: result.session?.refresh_token,
          user: {
            id: result.user?.id,
            email: result.user?.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.substring(7);

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token not provided',
        });
      }

      const result = await authService.logout(token);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}