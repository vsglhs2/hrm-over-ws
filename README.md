TODO:
    -4. add linter
  	-3. sometimes server doesn't get negotiation message
  	-2. need gracefully update service worker
  	-1. handler swap mechanism that can transfer pending requests. Add some ready close events to transport
  	0. pass binary data between server and client - ok
  	1. think about when to create sockets, when to kill them
  	2. add gzip compression
  	3. push negotiation from sw.ts file - ok
  	4. fetch data beforehand (on initialization) - ok
  	4.5 make beforehand data fetching optional
  	5. handle caching (integrate caching middleware for early 304)
  	6. fetch code without source map initially?
  	7  check socket pool
  	8. do service worker injection before able to load page
  	9. make plugin to be able run standalone
  	10. split code
  	11. refactor server-side
  	12. check on remote server (work with origin, base_url and etc) (code-server especially)
	13. add option to turnoff source maps
 
Problems:
	1. SSR
   	2. What if there is service worker on / scope already?