/// <reference lib="webworker" />

import { io, Socket } from 'socket.io-client';

type JSONValue = 
| string
| number
| boolean
| null
| JSONValue[]
| { [key: string]: JSONValue };

const eventPrefix = 'hmr';

type TransportOptions = {
  origin: string;
  path: string;
};

abstract class Transport {
  protected origin: string;
  protected path: string;

  constructor(options: TransportOptions) {
    this.origin = options.origin;
    this.path = options.path;
  }

  public abstract open(): void;
  public abstract close(): void;
  public abstract send(type: string, payload: unknown): void;
  public abstract wait(type: string, callback: (payload: unknown) => void): void;
  public abstract sendAndWait(type: string, payload: unknown): Promise<unknown>;
}

type SocketTransportOptions = TransportOptions;

class SocketTransport extends Transport {
  protected socket: Socket;

  constructor(options: SocketTransportOptions) {
    super(options);

    const ioAppendix = `${options.path}`;
    const socket = this.socket = io(options.origin, {
      transports: ['websocket'],
      path: ioAppendix,
    });

    socket.on('connect', () => {
      console.log(`connected to ${ioAppendix}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`disconnected from ${ioAppendix}:`, reason);
    });

    socket.on('error', (error) => console.error(`error on ${ioAppendix}`, error));
  }

  public open() {
    this.socket.connect();
  }

  public close() {
    this.socket.close();
  }

  public send(type: string, payload: unknown) {
    this.socket.emit(type, payload);
  }

  public wait(type: string, callback: (payload: unknown) => void): void {
    this.socket.on(type, payload => {
      this.socket.off(type, callback);

      callback(payload);
    });
  }

  public async sendAndWait(type: string, payload: unknown): Promise<unknown> {
    return this.socket.emitWithAck(type, payload);
  }
}

type BalancerOptions = {
  max: number;
};

class Balancer {
  private max: number;
  private _current: number;

  constructor(options: BalancerOptions) {
    this.max = options.max;
    this._current = 0;
  }

  current() {
    return this._current;
  }

  next() {
    const current = this._current;
    this._current++;

    if (this._current === this.max)
      this._current = 0;

    return current;
  }
}

type PoolTransportOptions = TransportOptions & {
  poolAmount: number;
};

class PoolTransport extends Transport {
  private transports: Transport[];
  private balancer: Balancer;

  constructor(
    options: PoolTransportOptions,
    factory: (index: number) => Transport
  ) {
    super(options);

    this.transports = [];
    this.balancer = new Balancer({
      max: options.poolAmount,
    });

    for (let i = 1; i <= options.poolAmount; i++) {
      const transport = factory(i);
      this.transports.push(transport);
    }
  }

  public open() {
    this.transports.forEach(transport => transport.open());
  }

  public close() {
    this.transports.forEach(transport => transport.close());
  }

  public send(type: string, payload: unknown) {
    const index = this.balancer.next();
    const transport = this.transports[index];
    console.log('# sended by: ', index);

    transport.send(type, payload);
  }

  public wait(type: string, callback: (payload: unknown) => void): void {
    const index = this.balancer.current();
    const transport = this.transports[index];
    console.log('# waited by: ', index);

    transport.wait(type, callback);
  }

  public async sendAndWait(type: string, payload: unknown): Promise<unknown> {
    const index = this.balancer.next();
    const transport = this.transports[index];
    console.log('# sended and waited by: ', index);

    return transport.sendAndWait(type, payload);
  }
}

enum TransportVariant {
  SOCKET_POOL,
  SOCKET,
};

type VariantOptions<Variant extends TransportVariant> = {
  [TransportVariant.SOCKET]: TransportOptions;
  [TransportVariant.SOCKET_POOL]: PoolTransportOptions;
}[Variant];

function createTransport<const Variant extends TransportVariant>(
  variant: Variant,
  options: VariantOptions<Variant>
): Transport {
  if (variant === TransportVariant.SOCKET_POOL) return new PoolTransport(
    options as PoolTransportOptions,
    () => new SocketTransport(options),
  );

  return new SocketTransport(options);
}

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

// TODO: pass to request and response serializers as options

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

class ResponseSerializer extends Uint8ArraySerialized<Response> {
  protected jsonSerializer: JsonSerializer<ResponseJson>;
  protected numberSerializer: NumberSerializer;

  constructor () {
    super();

    this.jsonSerializer = new JsonSerializer<ResponseJson>();
    this.numberSerializer = new NumberSerializer();
  }

  public async serialize(response: Response): Promise<Uint8Array> {
    const headers = getHeadersRecord(response.headers);

    const json: ResponseJson = {
      url: response.url,
      statusCode: response.status,
      headers: headers,
    };

    const jsonArray = this.jsonSerializer.serialize(json);

    // Always NUMBER_BYTES_LENGTH bytes
    const jsonLengthArray = this.numberSerializer.serialize(jsonArray.byteLength); 
    if (jsonLengthArray.byteLength !== NUMBER_BYTES_LENGTH)
      throw new Error('Incorrect number was passed: ' + jsonArray.byteLength);

    const bodyBuffer = await response.arrayBuffer();
    const bodyArray = new Uint8Array(bodyBuffer);

    return concatUInt8Arrays([jsonLengthArray, jsonArray, bodyArray]);
  }

  public deserialize(response: Uint8Array): Response {
    const jsonLengthArray = response.slice(0, NUMBER_BYTES_LENGTH);
    const jsonLength = this.numberSerializer.deserialize(jsonLengthArray);

    const jsonArray = response.slice(
      NUMBER_BYTES_LENGTH,
      jsonLength + NUMBER_BYTES_LENGTH
    );
    const json: ResponseJson = this.jsonSerializer.deserialize(jsonArray);

    const bodyArray = response.slice(jsonArray.length + NUMBER_BYTES_LENGTH);
    const bodyBuffer = bodyArray.buffer;
    
    return new Response(bodyBuffer, json);
  }
}

type RequestState = {
  request: Request;
  options: RequestOptions;  
  response?: Response;
  promise?: Promise<Response>;
};

type RequestOptions = {
  // maybe boolean | ((request: Request) => boolean) ?
  reuse: boolean;
};

function resolveRequestOptions(options: Partial<RequestOptions> | undefined): RequestOptions {
  return {
    reuse: false,
    ...options,
  };
}

abstract class RequestHandler {
  protected stateMap: WeakMap<Request, RequestState>;
  protected requestMap: Map<string, Request[]>;

  protected requestSerializer: RequestSerializer;
  protected responseSerializer: ResponseSerializer;

  constructor() {
    this.stateMap = new Map();
    this.requestMap = new Map();

    this.requestSerializer = new RequestSerializer();
    this.responseSerializer = new ResponseSerializer();
  }

  protected abstract process(request: Request): Promise<Response>;

  public async request(request: Request, options?: Partial<RequestOptions>): Promise<Response> {
    const resolvedOptions = resolveRequestOptions(options);
    const state = this.acquireState(request, resolvedOptions);

    const promise = state.promise ?? this.process(request).then(response => {
      state.response = response;
      return response;
    });
    state.promise = promise;

    return promise.then(response => response.clone());
  }

  protected getState(request: Request): RequestState | undefined {
    return this.stateMap.get(request);
  }

  protected acquireState(request: Request, options: RequestOptions): RequestState {
    const key = request.url + request.method;

    let sameKeyRequests = this.requestMap.get(key);
    if (sameKeyRequests?.length && options.reuse) {
      return this.getState(sameKeyRequests[0])!;
    }

    if (!sameKeyRequests) sameKeyRequests = this.requestMap.set(key, []).get(key);
    sameKeyRequests!.push(request);

    const state: RequestState = {
      request: request,
      options: options,
    };
    this.stateMap.set(request, state);

    return state;
  }

  public close() {}
}

class TransportModuleHandler extends RequestHandler {
  protected transport: Transport;

  constructor(transport: Transport) {
    super();

    this.transport = transport;
    this.transport.open();
  }

  public async process(request: Request) {
    // const REQUEST_TIMEOUT_DELAY = 100_000;

    try {
      const serialized = this.requestSerializer.serialize(request);      
      const response = await this.transport.sendAndWait(
        'module',
        serialized
      ) as ArrayBuffer;

      return this.responseSerializer.deserialize(new Uint8Array(response));
    } catch (err) {
      const error = err instanceof Error
        ? err
        : new Error(`Unknown error: ${String(err)}`);

      return new Response(error.message, {
        status: 404,
      });
    }
  }

  public close(): void {
    this.transport.close();
  }
}

const BUFFERED_REQUEST_TIMEOUT = 10_000;

class BufferedHandler extends RequestHandler {
  protected buffer: Request[];
  protected eventTarget: EventTarget;

  constructor() {
    super();

    this.buffer = [];
    this.eventTarget = new EventTarget();
  }

  public transfer(callback: (request: Request) => Promise<Response>) {
    for (const request of this.buffer) {
      callback(request).then(response => {
        const event = new CustomEvent('process', {
          detail: {
            request: request,
            response: response,
          },
        });

        this.eventTarget.dispatchEvent(event);
      });
    }
  }

  public process(request: Request) {
    const controller = new AbortController();
    this.buffer.push(request);

    return new Promise<Response>((resolve) => {
      this.eventTarget.addEventListener('process', e => {
        const { detail } = e as CustomEvent<{ request: Request, response: Response }>;
        if (request !== detail.request) return;

        resolve(detail.response);
        controller.abort();
      });

      setTimeout(() => {
        controller.abort(`Timeout for ${request.url} request`)
      }, BUFFERED_REQUEST_TIMEOUT);

      controller.signal.onabort = () => {
        const response = new Response(controller.signal.reason, {
          status: 404,
        });

        resolve(response);
      };
    });
  }
}

if (!import.meta.hot)
  throw Error('This service script must work only along with vite hmr');

type Store = {
  handler: RequestHandler;
  info: InitializationInfo | null;
};

function createDefaultStore(): Store {
  return {
    handler: new BufferedHandler(),
    info: null,
  };
}

const store = createDefaultStore();

const { hot } = import.meta;
hot.accept();

type InitializationInfo = {
  variant: TransportVariant;
  options: VariantOptions<TransportVariant>;
}

/**
 * Better use something else?
 */
function isSameObject(a: Record<string, unknown>, b: Record<string, unknown>) {
  return JSON.stringify(a) === JSON.stringify(b);
}

hot.dispose(() => store.handler.close());

hot.on(`${eventPrefix}:initialize`, (info: InitializationInfo) => {
  console.log('Got initialize info:', info);

  const needChangeHandler = !store.info || !isSameObject(info, store.info);
  if (!needChangeHandler) {
    console.log('Initialization info is the same');
    return;
  }

  console.log('Changing handler...');

  const oldHandler = store.handler;
  oldHandler.close();

  console.log('Closed previous handler: ', oldHandler.constructor.name);

  const transport = createTransport(info.variant, info.options);
  store.handler = new TransportModuleHandler(transport);
  store.info = info;

  console.log('Created new handler: ', oldHandler.constructor.name);

  if (oldHandler instanceof BufferedHandler) {
    oldHandler.transfer(request => store.handler.request(request));
  }
});

const { promise, resolve } = Promise.withResolvers();

hot.on(`${eventPrefix}:modules`, (moduleUrls: string[]) => {
  console.log('Modules list: ', moduleUrls);

  const promises = moduleUrls.map(moduleUrl => {
    console.log('fetch: ', moduleUrl);
    return store.handler.request(new Request(moduleUrl), {
      reuse: true,
    })    
  });

  resolve(undefined);
  // resolve(promises[promises.length - 1]);
});

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = 'site-cache-v1';

const urlsToFetch = [
  /src\/*/,
  /node_modules\/*/,
  /@react-refresh/,
  /client/,
  /index.scss/,
];

enum ServiceWorkerMessageType {
  NEGOTIATE,
};

type ServiceWorkerNegotiationMessage = {
  type: ServiceWorkerMessageType.NEGOTIATE;
}
type ServiceWorkerMessage = ServiceWorkerNegotiationMessage;

sw.addEventListener('message', e => {
  const { type } = e.data as ServiceWorkerMessage;
  if (type !== ServiceWorkerMessageType.NEGOTIATE) return;

  hot.send(`${eventPrefix}:negotiate`);
  console.log('Send negotiation request');
});

sw.addEventListener('fetch', async event => {
  const { request } = event;

  console.log('## fetch from sw:', request.url);

  const needToFetch =
    request.method.toUpperCase() === 'GET' &&
    urlsToFetch.some(url => url.test(request.url)) &&
    // TODO: get rid of it
    !request.url.includes('src/sw.ts');

  if (needToFetch) {
    return event.respondWith(promise.then(() => store.handler.request(request, {
      reuse: false,
    })));
  }

  if (!needToFetch) {
    // console.log('skip caching non-GET request', response.url)
    return fetch(request, {
      credentials: 'same-origin',
    });
  }

  event.respondWith(
    caches.match(request)
      .then(response => {
        // If the request is found in the cache, return the cached version
        if (response) {
          // console.log('already cached', response.url)
          return response;
        }

        // Otherwise, fetch from the network
        return fetch(request).then(response => {
          // Optionally cache the fetched resource
          return caches.open(CACHE_NAME).then(cache => {
            if (request.url.startsWith('http')) {
              cache.put(request, response.clone());
              // console.log('cached', response.url);
            }
            return response;
          });
        });
      })
  );
});

// Install the Service Worker and cache assets
sw.addEventListener('install', event => {
  sw.skipWaiting();
  // console.log('install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // console.log('Opened cache');
        // return cache.addAll(urlsToCache);
      })
  );
});

sw.addEventListener('activate', event => {
  // console.log('activate');
  event.waitUntil(sw.clients.claim());
});
 

/**
 * TODO:
 *  -3. sometimes server doesn't get negotiation message
 *  -2. need gracefully update service worker
 *  -1. handler swap mechanism that can transfer pending requests. Add some ready close events to transport
 *  0. pass binary data between server and client - ok
 *  1. think about when to create sockets, when to kill them
 *  2. add gzip compression
 *  3. push negotiation from sw.ts file - ok
 *  4. fetch data beforehand (on initialization) - ok
 *  4.5 make beforehand data fetching optional
 *  5. handle caching (integrate caching middleware for early 304)
 *  6. fetch code without source map initially?
 *  7  check socket pool
 *  8. do service worker injection before able to load page
 *  9. make plugin to be able run standalone
 *  10. split code
 *  11. refactor server-side
 *  12. check on remote server (work with origin, base_url and etc) (code-server especially)
 * 
 * Problems:
 *   1. SSR
 *   2. What if there is service worker on / scope already?
 */