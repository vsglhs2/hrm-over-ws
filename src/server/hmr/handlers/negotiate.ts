import type { ServerEnvironment } from '@/lib/environment/server';
import { JsonSerializer } from '@/lib/serializer';
import { replacerFunction } from '@/lib/utils/json-transform-functions';

export function negotiateHandler(this: ServerEnvironment) {
	const jsonSerializer = new JsonSerializer({
		replacer: replacerFunction,
	});
	// @ts-expect-error Options contains function type in it
	const serializedOptions = jsonSerializer.serialize(this.options);
	console.log('Got negotiation request');

	// Need to pass array as under the hood payload will be JSON.stringify
	const serializedOptionsArray = Array.from(serializedOptions);
	this.server.ws.send(this.eventName('initialization'), serializedOptionsArray);
	console.log('Send initialization message');

	const moduleUrls = Array.from(this.server.moduleGraph.urlToModuleMap.keys());
	this.server.ws.send(this.eventName('prefetch'), moduleUrls);
	console.log('Send module urls message');
}
