export function applyHMRHandlers(
    hot: ServiceWorkerGlobalScope,
    handlers: ServiceWorkerHandler[]
) {
    for (const handler of handlers) {
        sw.addEventListener(
            handler.type,
            handler.listener,
            handler.options,
        );
    }
}
 
export function initializeHMR(
    hot: ServiceWorkerGlobalScope,
    handlers: ServiceWorkerHandler[]
) {
    applyHMRHandlers(sw, handlers);
}
