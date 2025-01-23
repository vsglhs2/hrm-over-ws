import type { ServiceWorkerEnvironment } from '@/lib/environment/client';
import type { ServiceWorkerHandler } from '../service-worker/handlers/handler';

export function applyHMRHandlers(
	this: ServiceWorkerEnvironment,
	handlers: ServiceWorkerHandler[],
) {
	for (const handler of handlers) {
		this.hot.on(
			this.eventName(handler.type),
			handler.listener.bind(this),
		);
	}
}

export function initializeHMR(
	this: ServiceWorkerEnvironment,
	handlers: ServiceWorkerHandler[],
) {
	this.hot.accept();

	// hot.dispose(() => store.handler.close());

	applyHMRHandlers.call(this, handlers);
}
