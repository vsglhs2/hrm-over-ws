import { ServiceWorkerEnvironment } from '@/lib/environment';
import { ServiceWorkerHandler } from '../service-worker/handlers/handler';

export function applyHMRHandlers(
	this: ServiceWorkerEnvironment,
	handlers: ServiceWorkerHandler[],
) {
	for (const handler of handlers) {
		this.hot.on(
			handler.type,
			handler.listener,
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
