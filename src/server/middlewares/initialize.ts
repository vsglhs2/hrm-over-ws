import { ServerEnvironment } from '@/lib/environment/server';
import { installMiddleware, serviceWorkerScriptMiddleware } from './handlers';

export function initializeServerMiddlewares(this: ServerEnvironment) {
	this.server.middlewares.use(installMiddleware.bind(this));
	this.server.middlewares.use(serviceWorkerScriptMiddleware.bind(this));
}

export function initializeServer(this: ServerEnvironment) {
	initializeServerMiddlewares.call(this);
}
