import { createEventNamer } from '@/lib/utils';
import { PluginOptions } from '@/options';

export type PartialClientEnvironmentOptions = {
    options: Pick<PluginOptions, 'constants'>;
};

export class PartialClientEnvironment {
	public readonly options: Pick<PluginOptions, 'constants'>;
	public readonly eventName: ReturnType<typeof createEventNamer>;

	constructor({ options }: PartialClientEnvironmentOptions) {
		this.options = options;
		this.eventName = createEventNamer(options.constants.eventPrefix);
	}
};

// THINK: Is it supposed to be here?
export const PARTIAL_OPTIONS: PartialClientEnvironmentOptions = {
	options: {
		constants: {
			eventPrefix: __EVENT_PREFIX__,
			serviceWorker: {
				installedHeader: __SERVICE_WORKER_INSTALLED_HEADER__,
				scriptPath: __SERVICE_WORKER_SCRIPT_PATH__,
				installPagePath: __SERVICE_WORKER_INSTALL_PAGE_PATH__,
				installPageSources: __SERVICE_WORKER_INSTALL_PAGE_SOURCES__,
			},
		},
	},
};
