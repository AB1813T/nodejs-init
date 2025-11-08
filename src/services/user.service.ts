import { and, eq, ne } from 'drizzle-orm';
import { db } from '../config/db.config';
import { users } from '../models/user.model';
import { AppError } from '../middleware/error.middleware';
import { CreateUserInput, UpdateUserInput } from '../utils/validation';

export class UserService {
  async createUser(data: CreateUserInput) {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    if (existing) {
      throw new AppError(409, 'User with this email already exists');
    }

    const [user] = await db
      .insert(users)
      .values({
        ...data,
      })
      .returning();

    return user;
  }

  async getUsers() {
    return db.select().from(users);
  }

  async getUserById(userId: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }

  async updateUser(userId: string, data: UpdateUserInput) {
    if (data.email) {
      const [conflict] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, data.email), ne(users.id, userId)));

      if (conflict) {
        throw new AppError(409, 'User with this email already exists');
      }
    }

    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }

  async deleteUser(userId: string) {
    const [user] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return { message: 'User deleted successfully' };
  }
}
