import { ServerEnvironment } from '@/lib/environment/server';
import { negotiateHandler } from './handlers';

export function initializeHMRHandlers(this: ServerEnvironment) {
	this.server.ws.on(this.eventName('negotiate'), negotiateHandler.bind(this));
}

export function initializeHMR(this: ServerEnvironment) {
	initializeHMRHandlers.call(this);
}
