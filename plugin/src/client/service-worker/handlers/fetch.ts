import type { ServiceWorkerEnvironment } from '@/lib/environment/client';

const whitelist = [
	/src\/*/,
	/node_modules\/*/,
	/@react-refresh/,
	/@vite\/client/,
	/assets/,
	/index.scss/,
];

const blacklist: RegExp[] = [];

export function fetchHandler(this: ServiceWorkerEnvironment, event: FetchEvent) {
	const { request } = event;

	const isModule =
        request.method.toUpperCase() === 'GET' &&
        whitelist.some(url => url.test(request.url)) &&
        blacklist.every(url => !url.test(request.url));

	console.log('## fetch from sw:', request.url, isModule, performance.now());

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
