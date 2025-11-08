import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from './env.config';

// we export all models here to be used in the schema
import * as userSchema from '../models/user.model';
import * as blogSchema from '../models/blog.model';

const connectionString = config.database.url;
const client = postgres(connectionString);

export const db = drizzle(client, {
  schema: { ...userSchema, ...blogSchema },
});