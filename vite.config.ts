import { Connect, defineConfig, Plugin, ProxyOptions, ViteDevServer } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { ServerResponse } from 'node:http';
import httpMocks, { RequestMethod } from 'node-mocks-http';
import { Server } from 'socket.io';

type JSONValue = 
| string
| number
| boolean
| null
| JSONValue[]
| { [key: string]: JSONValue };

abstract class Serializer<A, B> {
  public abstract serialize(a: A): B | PromiseLike<B>;
  public abstract deserialize(b: B): A | PromiseLike<A>;
}

abstract class Uint8ArraySerialized<A> extends Serializer<A, Uint8Array> {
  protected encoder: TextEncoder;
  protected decoder: TextDecoder;

  constructor () {
    super();

    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }
}

const TARGET_HEADERS = [
  'if-none-match',
  'sec-fetch-dest',
  'accept',
];

type RequestJson = {
  url: string;
  method: string;
  headers: Record<string, string>;
};

class RequestSerializer extends Uint8ArraySerialized<Request> {
  protected jsonSerializer: JsonSerializer<RequestJson>;

  constructor () {
    super();

    this.jsonSerializer = new JsonSerializer<RequestJson>();
  }

  public serialize(request: Request): Uint8Array {
    const url = request.url;
    const headers: Record<string, string> = {};

    for (const header of TARGET_HEADERS) {
      if (!request.headers.has(header)) continue;

      headers[header] = request.headers.get(header)!;
    }

    const json: RequestJson = {
      url: url,
      method: request.method,
      headers: headers,
    };

    return this.jsonSerializer.serialize(json);
  }

  public deserialize(request: Uint8Array): Request {
    const json = this.jsonSerializer.deserialize(request);

    return new Request(json.url, {
      method: json.method,
      headers: json.headers,
    });
  }
}


class JsonSerializer<
  JSON extends JSONValue = JSONValue
> extends Uint8ArraySerialized<JSONValue> {
  public serialize(json: JSON): Uint8Array {
    const stringified = JSON.stringify(json);

    return this.encoder.encode(stringified);    
  }

  public deserialize(array: Uint8Array): JSON {
    const string = this.decoder.decode(array);

    return JSON.parse(string);
  }
}

class NumberSerializer extends Uint8ArraySerialized<number> {
  public serialize(number: number): Uint8Array {
    const { buffer } = new Float64Array([number]);

    return new Uint8Array(buffer);
  }

  public deserialize(array: Uint8Array): number {
    const { buffer } = array;

    return new Float64Array(buffer)[0];
  }
}

function concatUInt8Arrays(arrays: Uint8Array[]) {
  const length = arrays.reduce((length, array) => array.byteLength + length, 0);
  const output = new Uint8Array(length);

  let offset = 0;
  for (let i = 0; i < arrays.length; i++) {
    output.set(arrays[i], offset);

    offset += arrays[i].byteLength;
  }

  return output;
}

function getHeadersRecord(headers: Headers) {
  const record: Record<string, string> = {};

  for (const [header, value] of headers.entries()) {
    record[header] = value;
  }

  return record;
}

type ResponseJson = {
  url: string;
  statusCode: number;
  headers: Record<string, string>;
};

const NUMBER_BYTES_LENGTH = 8;

class ServerResponseSerializer extends Uint8ArraySerialized<ServerResponse> {
  protected jsonSerializer: JsonSerializer<ResponseJson>;
  protected numberSerializer: NumberSerializer;

  constructor () {
    super();

    this.jsonSerializer = new JsonSerializer<ResponseJson>();
    this.numberSerializer = new NumberSerializer();
  }

  public async serialize(response: ServerResponse): Promise<Uint8Array> {
    const headers = response.getHeaders() as Record<string, string>;

    const json: ResponseJson = {
      url: response.req.url!,
      statusCode: response.statusCode,
      headers: headers,
    };

    const jsonArray = this.jsonSerializer.serialize(json);
    const jsonLengthArray = this.numberSerializer.serialize(jsonArray.byteLength); 

     // @ts-expect-error TODO: find a way to retrieve data from response
    const bodyBuffer = this.encoder.encode(response._getData() as string);
    const bodyArray = new Uint8Array(bodyBuffer);

    return concatUInt8Arrays([jsonLengthArray, jsonArray, bodyArray]);
  }

  public deserialize(response: Uint8Array): ServerResponse {
    const jsonLengthArray = response.slice(0, NUMBER_BYTES_LENGTH);
    const jsonLength = this.numberSerializer.deserialize(jsonLengthArray);

    const jsonArray = response.slice(
      NUMBER_BYTES_LENGTH,
      jsonLength + NUMBER_BYTES_LENGTH
    );
    const json: ResponseJson = this.jsonSerializer.deserialize(jsonArray);

    const bodyArray = response.slice(jsonArray.length + NUMBER_BYTES_LENGTH);
    const bodyBuffer = bodyArray.buffer;
    
    const res: ServerResponse = httpMocks.createResponse({
      req: httpMocks.createRequest(json),
    });
    res.statusCode = json.statusCode;
    res.setHeaders(new Headers(json.headers));
    res.end(bodyBuffer);
 
    return res;
  }
}

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

type SerializedRequest = {
  url: string;
  method: string;
  headers: Record<string, unknown>;
};

type SerializedResponse = {
  url: string;
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

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

const hmrPlugin = (options: HmrPluginOptions = defaultOptions) => {
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
  } as Plugin;
}

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    hmrPlugin({
      variant: TransportVariant.SOCKET_POOL,
      options: {
        poolAmount: 1,
      }
    }),
    // {
    //   name: 'remove-sourcemaps',
    //   transform(code) {
    //     return {
    //       code,
    //       map: { mappings: '' }
    //     }
    //   }
    // }
  ],
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['node_modules']
      }
    }
  },
  esbuild: {
    target: 'es2020',
    supported: {
      'top-level-await': true,
    },
  },
})