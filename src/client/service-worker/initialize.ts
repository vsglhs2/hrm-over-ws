import type { ServiceWorkerEnvironment } from '@/lib/environment/client';
import type { ServiceWorkerHandler } from './handlers/handler';

export function applyServiceWorkerHandlers(
	this: ServiceWorkerEnvironment,
	handlers: ServiceWorkerHandler[],
) {
	for (const handler of handlers) {
		this.serviceWorker.addEventListener(
			handler.type,
			handler.listener.bind(this),
			handler.options,
		);
	}
}

export function initializeServiceWorker(
	this: ServiceWorkerEnvironment,
	handlers: ServiceWorkerHandler[],
) {
	applyServiceWorkerHandlers.call(this, handlers);
}
