import type { PluginOptions } from '@/options';
import { ClientEnvironment } from '../client';
import type { ClientEnvironmentOptions } from '../client';
import type { PartialClientEnvironmentOptions } from '../partial';

type ServiceWorkerEnvironmentOptions = ClientEnvironmentOptions & {
    serviceWorker: ServiceWorkerGlobalScope;
	hot: ViteHotContext;
	partialOptions: PartialClientEnvironmentOptions['options'];
	options: PluginOptions | undefined;
};

export class ServiceWorkerEnvironment extends ClientEnvironment {
	public readonly serviceWorker: ServiceWorkerGlobalScope;
	public readonly hot: ViteHotContext;
	public readonly partialOptions: PartialClientEnvironmentOptions['options'];
	// @ts-expect-error TODO: fix type later
	declare options: PluginOptions | undefined;

	constructor({ serviceWorker, hot, moduleHandler, partialOptions }: ServiceWorkerEnvironmentOptions) {
		// @ts-expect-error TODO: fix type later
		super({ options: partialOptions, moduleHandler });

		this.serviceWorker = serviceWorker;
		this.hot = hot;
		this.partialOptions = partialOptions;
		this.options = undefined;
	}
}
