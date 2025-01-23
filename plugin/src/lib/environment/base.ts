import type { PluginOptions } from '@/options';
import { createEventNamer } from '../utils';

export type EnvironmentOptions = {
    options: PluginOptions;
};

export class Environment {
	public readonly options: PluginOptions;
	public readonly eventName: ReturnType<typeof createEventNamer>;

	constructor({ options }: EnvironmentOptions) {
		this.options = options;
		this.eventName = createEventNamer(options.constants.eventPrefix);
	}
}
