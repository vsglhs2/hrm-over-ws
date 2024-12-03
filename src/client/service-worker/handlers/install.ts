const CACHE_NAME = 'site-cache-v1';

export const installHandler = (event: ExtendableEvent) => {
	sw.skipWaiting();
	// console.log('install');
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => {
				// console.log('Opened cache');
				// return cache.addAll(urlsToCache);
			})
	);
};
