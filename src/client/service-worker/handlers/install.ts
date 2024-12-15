import { ServiceWorkerEnvironment } from '@/lib/environment/client';

const CACHE_NAME = 'site-cache-v1';

export function installHandler(this: ServiceWorkerEnvironment, event: ExtendableEvent) {
	this.serviceWorker.skipWaiting();
	// console.log('install');
	event.waitUntil(
		caches.open(CACHE_NAME),
		// .then(cache => {
		// 	// console.log('Opened cache');
		// 	// return cache.addAll(urlsToCache);
		// }),
	);
};
