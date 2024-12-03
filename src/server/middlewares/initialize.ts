import { ServerEnvironment } from '@/lib/environment';
import { installMiddleware, serviceWorkerScriptMiddleware } from './handlers';

export function initializeServerMiddlewares(this: ServerEnvironment) {
	this.server.middlewares.use(installMiddleware);
	this.server.middlewares.use(serviceWorkerScriptMiddleware);
}

export function initializeServer(this: ServerEnvironment) {
	initializeServerMiddlewares.call(this);
}
