import { TransportModuleHandler, BufferedHandler } from '@/lib/handler';
import { isSameObject } from '@/lib/utils';
import { createTransport } from './create-transport';
import { JsonSerializer } from '@/lib/serializer';
import { reviverFunction } from '@/lib/utils/json-transform-functions';
import type { ServiceWorkerEnvironment } from '@/lib/environment/client';
import type { PluginOptions } from '@/options';

export function initializationHandler(this: ServiceWorkerEnvironment, optionsBuffer: number[]) {
	const jsonSerializer = new JsonSerializer({
		reviver: reviverFunction,
	});
	const optionsArray = new Uint8Array(optionsBuffer);
	const options = jsonSerializer.deserialize(optionsArray) as PluginOptions;

	console.log('Got initialize options:', options);

	const needChangeHandler = !this.options || !isSameObject(options, this.options);
	if (!needChangeHandler) {
		console.log('Initialization info is the same');
		return;
	}

	console.log('Changing handler...');

	const oldHandler = this.moduleHandler;
	oldHandler.close();

	console.log('Closed previous handler: ', oldHandler.constructor.name);

	const transport = createTransport(options.transport.variant, options.transport.options);
	this.moduleHandler = new TransportModuleHandler(transport, {
		eventName: this.eventName,
	});
	this.options = options;

	console.log('Created new handler: ', this.moduleHandler.constructor.name);

	if (oldHandler instanceof BufferedHandler) {
		oldHandler.transfer(request => this.moduleHandler.request(request));
	}
}
