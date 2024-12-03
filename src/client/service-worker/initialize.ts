import { ServiceWorkerHandler } from './handlers/handler';

export function applyServiceWorkerHandlers(
	sw: ServiceWorkerGlobalScope,
	handlers: ServiceWorkerHandler[],
) {
	for (const handler of handlers) {
		sw.addEventListener(
			handler.type,
			handler.listener,
			handler.options,
		);
	}
}

export function initializeServiceWorker(
	sw: ServiceWorkerGlobalScope,
	handlers: ServiceWorkerHandler[],
) {
	applyServiceWorkerHandlers(sw, handlers);
}
