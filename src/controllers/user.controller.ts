import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from '../utils/validation';

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await userService.createUser(data);

      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.getUsers();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = userIdSchema.parse(req.params);
      const user = await userService.getUserById(id);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = userIdSchema.parse(req.params);
      const data = updateUserSchema.parse(req.body);
      const user = await userService.updateUser(id, data);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = userIdSchema.parse(req.params);
      const result = await userService.deleteUser(id);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
