import { ServiceWorkerEnvironment } from '@/lib/environment';

export function activateHandler(this: ServiceWorkerEnvironment, event: ExtendableEvent) {
	// console.log('activate');
	event.waitUntil(this.serviceWorker.clients.claim());
};
