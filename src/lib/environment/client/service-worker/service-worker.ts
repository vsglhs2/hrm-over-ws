import { PluginOptions } from '@/options';
import { ClientEnvironment, ClientEnvironmentOptions } from '../client';
import { PartialClientEnvironmentOptions } from '../partial';

type ServiceWorkerEnvironmentOptions = ClientEnvironmentOptions & {
    serviceWorker: ServiceWorkerGlobalScope;
	hot: ViteHotContext;
	partialOptions: PartialClientEnvironmentOptions;
	options: PluginOptions | undefined;
};

export class ServiceWorkerEnvironment extends ClientEnvironment {
	public readonly serviceWorker: ServiceWorkerGlobalScope;
	public readonly hot: ViteHotContext;
	public readonly partialOptions: PartialClientEnvironmentOptions;
	// @ts-expect-error TODO: fix type later
	declare options: PluginOptions | undefined;

	constructor({ options, serviceWorker, hot, moduleHandler, partialOptions }: ServiceWorkerEnvironmentOptions) {
		super({ options, moduleHandler });

		this.serviceWorker = serviceWorker;
		this.hot = hot;
		this.partialOptions = partialOptions;
		this.options = undefined;
	}
}
