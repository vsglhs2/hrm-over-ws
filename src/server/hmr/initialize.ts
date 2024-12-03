import { ServerEnvironment } from '@/lib/environment';
import { negotiateHandler } from './handlers';

export function initializeHMRHandlers(this: ServerEnvironment) {
	this.server.ws.on(this.eventName('negotiate'), negotiateHandler);
}

export function initializeHMR(this: ServerEnvironment) {
	initializeHMRHandlers.call(this);
}
