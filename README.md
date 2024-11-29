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
 
# Potential problems

- SSR
- What if there is service worker on / scope already?

# Now

- create SerializableTransport and pass Socket transport in it
- move serialize logic from transport handler
- main handler must consists of buffered, fetch(transport) and module(transport) handlers
- make HttpFetchTransport do direct fetches and use eventTarget to trigger waits
- make main handlers be compatible with fetch api to substitute fetch when can not use own service worker
- write transfer logic to swap handlers on transport info change
- caching logic must stay on handler side
- compression logic may be on transport side
- think about server architecture for those thing
- add filter options to main handler options
- add custom options to plugin features
- add logic to align with features options