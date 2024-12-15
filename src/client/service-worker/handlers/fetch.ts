import { ServiceWorkerEnvironment } from '@/lib/environment';

const urlsToFetch = [
	/src\/*/,
	/node_modules\/*/,
	/@react-refresh/,
	/client/,
	/index.scss/,
];

export function fetchHandler(this: ServiceWorkerEnvironment, event: FetchEvent) {
	const { request } = event;

	console.log('## fetch from sw:', request.url);

	const isModule =
        request.method.toUpperCase() === 'GET' &&
        urlsToFetch.some(url => url.test(request.url)) &&
        // TODO: get rid of it
        !request.url.includes('src/sw.ts');

	if (isModule) {
		return event.respondWith(this.moduleHandler.request(request, {
			reuse: false,
		}));
	}

	// console.log('skip caching non-GET request', response.url)
	return fetch(request, {
		credentials: 'same-origin',
	});
};
