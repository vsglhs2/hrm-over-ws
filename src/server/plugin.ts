import { Connect, defineConfig, Plugin, ProxyOptions, ViteDevServer } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';
import { ServerResponse } from 'node:http';
import httpMocks, { RequestMethod } from 'node-mocks-http';
import { Server } from 'socket.io';

type FunctionToAsync<Func extends (...args: any[]) => any> =
  (...args: Parameters<Func>) => Promise<Awaited<ReturnType<Func>>>;

const SERVICE_WORKER_PATH = '/src/service-worker/sw';

const TRANSFORM_FUNCTION_NAME = 'viteTransformMiddleware';

function retrieveTransformFunctionFromServer(server: ViteDevServer) {
  const item = server.middlewares.stack.find(
    item => typeof item.handle === 'function' &&
      item.handle.name === TRANSFORM_FUNCTION_NAME
  );

  if (!item) throw new Error('Can\'t find viteTransformMiddleware function');

  return item.handle as FunctionToAsync<Connect.NextHandleFunction>;
}

function createServer(server: ViteDevServer, options: TransportOptions) {
  const io = new Server(server.httpServer!, {
    cors: {
      origin: '*',
    },
    path: options.path,
  });

  return io;
}

function initializeSocket(server: ViteDevServer, io: Server, options: TransportOptions) {
  const responseSerializer = new ServerResponseSerializer();
  const requestSerializer = new RequestSerializer();

  io.on('connection', socket => {
    const socketAppendix = `${socket.id}`;    

    console.log(`connected to ${socketAppendix}`);

    socket.on('disconnect', () => {
      console.log(`disconnected from ${socketAppendix}`);
    });

    socket.on('module', async (buffer, ack) => {
      const data = requestSerializer.deserialize(buffer);

      const req: Connect.IncomingMessage = httpMocks.createRequest({
        url: new URL(data.url).pathname,
        method: data.method as RequestMethod,
        headers: getHeadersRecord(data.headers),
      });

      try {
        // In function root middlewares array is empty
        const transformHandler = retrieveTransformFunctionFromServer(server);

        // console.log(`Requested module from ${socketAppendix}:`, data);

        const res: ServerResponse = httpMocks.createResponse({
          req: req,
        });

        await transformHandler(req, res, async (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });

        // @ts-expect-error TODO: somehow req is empty here, so serialize throws
        res.req = req;

        const serialized = await responseSerializer.serialize(res);
        ack(serialized.buffer);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error: ' + String(err));
        console.error(`Error during fetching module from ${socketAppendix}:`, error.message);

        const res: ServerResponse = httpMocks.createResponse({
          req: req,
        });
        res.statusCode = 404;
        res.end(error.message);

        const serialized = await responseSerializer.serialize(res);
        ack(serialized.buffer);
      }
    });
  });
}

enum TransportVariant {
  SOCKET_POOL,
  SOCKET,
};

type TransportOptions = {
  origin: string;
  path: string;
};

type PoolTransportOptions = TransportOptions & {
  poolAmount: number;
};

type VariantOptions<Variant extends TransportVariant> = {
  [TransportVariant.SOCKET]: TransportOptions;
  [TransportVariant.SOCKET_POOL]: PoolTransportOptions;
}[Variant];

type HmrPluginOptions<Variant extends TransportVariant = TransportVariant> = {
  variant?: Variant;
  options?: Partial<VariantOptions<Variant>>;
};

type ResolvedHmrPluginOptions = Required<HmrPluginOptions> & {
  options: VariantOptions<TransportVariant>;
};

const defaultOptions: HmrPluginOptions = {
  variant: TransportVariant.SOCKET,
  options: {
    origin: 'http://localhost:5173',
    path: '/ws/module'
  },
};

function resolveOptions(options: HmrPluginOptions) {
  return {
    ...defaultOptions,
    ...options,
    options: {
      ...defaultOptions.options,
      ...options.options,
    }
  } as ResolvedHmrPluginOptions;
}

const eventPrefix = 'hmr';
const INSTALL_PAGE_PATH = '/install-service-worker';
const INSTALL_PAGE_INSTALLED_HEADER = 'service-worker-powered';
const INSTALL_PAGE_SOURCES = [
  '/@vite/client',
  '/src/install.ts',
  '/node_modules/vite/dist/client/env.mjs',
  '/src/service-worker/sw.ts',
  INSTALL_PAGE_PATH
];

export function hrmOverSocketPlugin(
    options: HmrPluginOptions = defaultOptions
): Plugin {
  const resolvedOptions: ResolvedHmrPluginOptions = resolveOptions(options);

  return {
    name: 'hmr-plugin',

    config(config, env) {
      if (env.mode !== 'DEV') return config;

      const serverConfig = config.server ?? {};

      config.server = serverConfig;
      serverConfig.proxy = {
        ...serverConfig.proxy,
      };

      return config;
    },

    configureServer(server) {
      if (!server.httpServer)
        throw new Error('Plugin need server.httpServer to run');

      server.middlewares.use((req, res, next) => {
        if (
          req.headers.cookie?.includes(INSTALL_PAGE_INSTALLED_HEADER) ||
          req.url !== '/' && INSTALL_PAGE_SOURCES.some(
            url => req.url && (url.includes(req.url) || req.url.includes(url))
          ) || 
          req.headers['sec-fetch-dest'] === 'serviceworker'
        ) {
          return next();
        }

        res.writeHead(302, {
          'location': INSTALL_PAGE_PATH,
        });
        res.end();

        console.log('redirected to install page');
      });
      const io = createServer(server, resolvedOptions.options);
    
      const socketsAmount = 
        resolvedOptions.variant === TransportVariant.SOCKET_POOL
          ? (resolvedOptions.options as PoolTransportOptions).poolAmount
          : 1;

      const socketPath = resolvedOptions.options.path;
      const host = server.config.server.host ?? 'localhost';
      const port = server.config.server.port ?? 5173;
      const origin = `http://${host}:${port}`;
      
      for (let i = 1; i <= socketsAmount; i++) {
        initializeSocket(server, io, {
          origin: origin,
          path: socketPath,
        });
      }

      server.ws.on(`${eventPrefix}:negotiate`, () => {
        console.log('Got negotiation request')
        server.ws.send(`${eventPrefix}:initialize`, resolvedOptions);

        const moduleUrls = Array.from(server.moduleGraph.urlToModuleMap.keys());
        server.ws.send(`${eventPrefix}:modules`, moduleUrls);
      });
      server.middlewares.use('/', (
        req: Connect.IncomingMessage,
        res: ServerResponse,
        next: Connect.NextFunction
      ) => {
        const url = req.originalUrl as string;

        if (url.includes(SERVICE_WORKER_PATH)) {
          res.setHeader("Service-Worker-Allowed", "/");
          res.setHeader("Content-Type", "text/javascript");
        }

        next();
      });
    },
  };
}