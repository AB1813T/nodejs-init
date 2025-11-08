import { OpenAPIRegistry, OpenApiGeneratorV3, RouteConfig } from '@asteasolutions/zod-to-openapi';
import { config } from '../config/env.config';

export const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Enter your Supabase access token',
});

export const documentRoute = (route: RouteConfig) => {
  registry.registerPath(route);
};

export const createSwaggerDocument = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Nodejs Init application API Documentation',
      version: '1.0.0',
      description:
        'API documentation for Nodejs Init application with Supabase authentication',
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Blogs', description: 'Blog management endpoints' },
      { name: 'Users', description: 'User management endpoints' },
    ],
  });
};
