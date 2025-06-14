# Motivation

During attempt to use code-server remotely and running vite powered app, page loading and reloading with 250+ files takes around a minute due request fetching speed. Even when server gives 304 response (not modified), each request still required to make full roundtrip and it is take a lot of time. This plugin is trying to address this issue

# State

This plugin is a proof of concept to trying to improve experience for concrete use case. It can be helpful for some people, but i think in most cases there is a problem with slowness in local environment caused by 1000+ requests. It is well known problem with vite, but as it is part of its core (transform modules on fly with ESM modules), there is not so much to do without trying to make it to be more webpack like and it is not issue targeted by this project. In teory, some performance gains can be accomplished, though, but it is not feasible to say if it could work well enough.

# Scripts

## Plugin
```
cd plugin
```

### Install
```
npm i
```

### Build
```
npm run build
```

### Watch
```
npm run watch
```

## Playground
```
cd playground
```

### Install
```
npm i
```

### Dev
```
npm run dev
```

### Build
```
npm run build
```

# TODO

-   rewrite build.mjs using js apis instead of using cli through exec
-   change all file paths to constants and move scripts from package.json to js scripts
-   does defines even needed? - ok
-   use server.transformRequest instead of using mocks and retrieving transform middleware
-   figure out why direct default import doesn't work when trying to test plugin
-   fix vite-env.d.ts file (it is not being referenced by ts somehow) - ok
-   add linter - ok
-   sometimes server doesn't get negotiation message
-   need gracefully update service worker
-   handler swap mechanism that can transfer pending requests. Add some ready close events to transport
-   pass binary data between server and client - ok
-   think about when to create sockets, when to kill them - ok
-   add gzip compression
-   push negotiation from sw.ts file - ok
-   fetch data beforehand (on initialization) - ok
-   make beforehand data fetching optional
-   make prefetching block requests before fully done
-   handle caching (integrate caching middleware for early 304)
-   fetch code without source map initially?
-   check socket pool - ok
-   do service worker injection before able to load page - ok
-   make plugin to be able run standalone - ok
-   split code - ok
-   refactor server-side
-   refactor client-side
-   check on remote server (work with origin, base_url and etc) (code-server especially)
-   add option to turnoff source maps
-   add custom logger
-   try WebTransport API as alternative for WebSockets?
-   add version validation between client and service-worker to force update
-   maybe consider partial prebundles to reduce requests amount?
-   add ordering options to prefetch feature (large files can be bottlenecks when statically import, so there is area to improve such cases)
-   check if transform on demand can be part of problem too (doubt it'll help)
-   add cache invalidation
-   make caching be in-memory (maybe add option to utilize cache api or OPFS caching?)
-   add zstd compression with dictionaries
-   test with https://github.com/michalzubkowicz/slow-vite-demo.git
-   explore if it is possible to use blob urls for faster processing then simply return response from in-memory stored array buffer
-   explore how to change all static imports by dynamic imports for such use case
-   test performance of all static vs all dynamic imports (maybe dynamic imports will be slower, so approach would be dead end)
-   explore if it is possible to update import using array buffer instead of some form of url - no possible directly
-   test if immediate response cloning (right at the moment when deserialization done) will be faster then cloning on demand
-   think about environment swap (on client, particularly)
-   maybe try to add option to prebundle files based on some pattern (i. e. join files in subdirectory) and treat them as single module?

# Potential problems

-   SSR (not working with vite as i recall so maybe not a problem?)
-   What if there is service worker on / scope already?
-   Some edge cases with cache?

# Now

-   think about server architecture for those thing - ok
-   add filter options to main handler options - ok
-   add custom options to plugin features
-   add logic to align with features options

# New thoughts

-   let handlers be transports
-   let transports for service worker, hmr, socket, fetch on client and server
-   let transports be transport layers
-   let transport have stack and layers fields
-   let it pass income events through its stack
-   let layer have its state, status
-   let transport be notified of layer status changes
-   let buffered and module transports be layers
-   let transport swap broken socket layer to buffered layer
-   let service worker and hrm transports consists only from service worker and hrm layers respectively
-   let fetch transport consist of cache, compress, fetchHttp layers
-   let module transport consist of cache, serialize, compress, (pool -> socket, socket, fetch, buffered) layers
-   let server side have respective transports with same layers
-   let http fetch layers have http server layer
-   let fetch patch middleware override res.end function and pass response through fetch transport layers before sending response back (is it okay trough?) (must be aware that headers can be already sent at this moment, but its okay, while it is only for body compression) (maybe fetched body better be decompressed by browser with special header? It is more appropriate, but manual decompressing seems aligning with other layers (socket, etc))
-   move transport options to feature set
