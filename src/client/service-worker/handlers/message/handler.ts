import { ServiceWorkerEnvironment } from '@/lib/environment/client';
import { ServiceWorkerMessage, ServiceWorkerMessageType } from './utils';

export function messageHandler(this: ServiceWorkerEnvironment, event: ExtendableMessageEvent) {
	const data = event.data as ServiceWorkerMessage;

	if (data.type !== ServiceWorkerMessageType.NEGOTIATE) return;

	this.hot.send(this.eventName('negotiate'));
	console.log('Send negotiation request');
};
