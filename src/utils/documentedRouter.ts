import { Router, RequestHandler } from 'express';
import type {
  ResponseConfig,
  RouteConfig,
  RouteParameter,
  ZodMediaType,
} from '@asteasolutions/zod-to-openapi/dist/openapi-registry';
import { ZodTypeAny } from 'zod';
import { documentRoute } from '../docs/openapi';

type Method = RouteConfig['method'];
type RouteRequest = NonNullable<RouteConfig['request']>;

interface RequestConfig {
  body?: {
    schema: ZodTypeAny;
    description?: string;
    required?: boolean;
    mediaType?: ZodMediaType;
  };
  params?: RouteParameter;
  query?: RouteParameter;
  headers?: RouteRequest['headers'];
}

interface DocumentedRoute {
  summary: string;
  description?: string;
  tags?: string[];
  security?: boolean;
  request?: RequestConfig;
  responses: Record<
    number,
    {
      description: string;
      schema?: ZodTypeAny;
      mediaType?: ZodMediaType;
    }
  >;
}

interface DocumentedRouterOptions {
  basePath: string;
  defaultTags?: string[];
  secureByDefault?: boolean;
}

type MethodHandler = (
  path: string,
  docs: DocumentedRoute,
  ...handlers: RequestHandler[]
) => Router;

const normalizePath = (basePath: string, path: string) => {
  const prefixedBase =
    basePath && !basePath.startsWith('/') ? `/${basePath}` : basePath;
  const sanitizedBase =
    prefixedBase && prefixedBase.endsWith('/') && prefixedBase !== '/'
      ? prefixedBase.slice(0, -1)
      : prefixedBase || '';

  if (!path || path === '/') {
    return sanitizedBase || '/';
  }

  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${sanitizedBase}${suffix}`.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
};

const resolveSecurity = (
  routeSecurity: boolean | undefined,
  defaultSecurity?: boolean
) => {
  const enabled = routeSecurity ?? defaultSecurity;
  return enabled ? [{ BearerAuth: [] }] : undefined;
};

const buildRequest = (request?: RequestConfig): RouteConfig['request'] | undefined => {
  if (!request) {
    return undefined;
  }

  const built: RouteConfig['request'] = {};

  if (request.body) {
    built.body = {
      description: request.body.description,
      required: request.body.required ?? true,
      content: {
        [request.body.mediaType ?? 'application/json']: {
          schema: request.body.schema,
        },
      },
    };
  }

  if (request.params) {
    built.params = request.params;
  }

  if (request.query) {
    built.query = request.query;
  }

  if (request.headers) {
    built.headers = request.headers;
  }

  return built;
};

const buildResponses = (
  responses: DocumentedRoute['responses']
): RouteConfig['responses'] => {
  return Object.entries(responses).reduce((acc, [status, response]) => {
    acc[status] = {
      description: response.description,
      content: response.schema
        ? {
            [response.mediaType ?? 'application/json']: {
              schema: response.schema,
            },
          }
        : undefined,
    } satisfies ResponseConfig;

    return acc;
  }, {} as RouteConfig['responses']);
};

export const createDocumentedRouter = (options: DocumentedRouterOptions) => {
  const router = Router();

  const withMethod = (method: Method): MethodHandler => {
    return (path, docs, ...handlers) => {
      documentRoute({
        method,
        path: normalizePath(options.basePath, path),
        summary: docs.summary,
        description: docs.description,
        tags: docs.tags ?? options.defaultTags,
        security: resolveSecurity(docs.security, options.secureByDefault),
        request: buildRequest(docs.request),
        responses: buildResponses(docs.responses),
      });

      (router as any)[method](path, ...handlers);
      return router;
    };
  };

  return {
    router,
    get: withMethod('get'),
    post: withMethod('post'),
    put: withMethod('put'),
    patch: withMethod('patch'),
    delete: withMethod('delete'),
    options: withMethod('options'),
    head: withMethod('head'),
    use: router.use.bind(router),
  };
};
