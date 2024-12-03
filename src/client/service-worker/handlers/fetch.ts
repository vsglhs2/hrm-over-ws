const urlsToFetch = [
	/src\/*/,
	/node_modules\/*/,
	/@react-refresh/,
	/client/,
	/index.scss/
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
			reuse: false
		})));
	}

	if (!needToFetch) {
		// console.log('skip caching non-GET request', response.url)
		return fetch(request, {
			credentials: 'same-origin'
		});
	}
};
