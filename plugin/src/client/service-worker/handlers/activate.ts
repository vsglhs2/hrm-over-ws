import type { ServiceWorkerEnvironment } from '@/lib/environment/client';

export function activateHandler(this: ServiceWorkerEnvironment, event: ExtendableEvent) {
	// console.log('activate');
	event.waitUntil(this.serviceWorker.clients.claim());
};
