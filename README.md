# Motivation

When i was trying to use code-server remotely and ran vite powered app, i faced a major problem - page loading and reloading with 250+ files takes about a minute due request fetching speed, which is totally unacceptable when trying to reach decent remote dev experience. Even when server gives 304 response, each request still required to make full roundtrip and it is take a lot of time. And sequential nature of vite module processing is what makes it even worse in described case. So to address this issue, i started to work on this plugin.

# State

This plugin is a proof of concept and primary just side project of me to trying to improve experience for my own use case. I can assume that it can be helpful for some people, but i think in most cases there is a problem with slowness in local environment caused by 1000+ requests. It is well know problem with vite, but as it is part of its core decisions (transform modules on fly with ESM modules), there not so much to do without trying to make it to be more webpack like and it is not issue i target by this project. Some performance gains in theory can be accomplished, though, but it is not feasible to say if it could work well enough.

# TODO

-   add linter
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
-   do service worker injection before able to load page
-   make plugin to be able run standalone
-   split code
-   refactor server-side
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
