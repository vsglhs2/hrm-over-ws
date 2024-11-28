const urlsToFetch = [
    /src\/*/,
    /node_modules\/*/,
    /@react-refresh/,
    /client/,
    /index.scss/,
  ];

export const fetchHandler = (event: FetchEvent) => {
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
}
