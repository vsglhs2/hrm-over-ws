# TODO

- add linter
- sometimes server doesn't get negotiation message
- need gracefully update service worker
- handler swap mechanism that can transfer pending requests. Add some ready close events to transport
- pass binary data between server and client - ok
- think about when to create sockets, when to kill them - ok
- add gzip compression
- push negotiation from sw.ts file - ok
- fetch data beforehand (on initialization) - ok
- make beforehand data fetching optional
- make prefetching block requests before fully done
- handle caching (integrate caching middleware for early 304)
- fetch code without source map initially?
- check socket pool - ok
- do service worker injection before able to load page
- make plugin to be able run standalone
- split code
- refactor server-side
- check on remote server (work with origin, base_url and etc) (code-server especially)
- add option to turnoff source maps
- add custom logger
- try WebTransport API as alternative for WebSockets?
 
# Potential problems

- SSR
- What if there is service worker on / scope already?

# Now

<!-- - create SerializableTransport and pass Socket transport in it
- move serialize logic from transport handler
- main handler must consists of buffered, fetch(transport) and module(transport) handlers
- make HttpFetchTransport do direct fetches and use eventTarget to trigger waits
- make main handlers be compatible with fetch api to substitute fetch when can not use own service worker
- write transfer logic to swap handlers on transport info change
- caching logic must stay on handler side
- compression logic may be on transport side -->

- think about server architecture for those thing
- add filter options to main handler options
- add custom options to plugin features
- add logic to align with features options


# New thoughts

- let handlers be transports
- let transports for service worker, hmr, socket, fetch on client and server
- let transports be transport layers
- let transport have stack and layers fields
- let it pass income events through its stack
- let layer have its state, status
- let transport be notified of layer status changes
- let buffered and module transports be layers
- let transport swap broken socket layer to buffered layer
- let service worker and hrm transports consists only from service worker and hrm layers respectively
- let fetch transport consist of cache, compress, fetchHttp layers
- let module transport consist of cache, serialize, compress, (pool -> socket, socket, fetch, buffered) layers
- let server side have respective transports with same layers
- let http fetch layers have http server layer
- let fetch patch middleware override res.end function and pass response through fetch transport layers before sending response back (is it okay through?)
