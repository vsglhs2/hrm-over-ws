import { TransportVariant, TransportConfig } from "@/lib/transport/types";

export type PluginFeatures = {
	prefetch: boolean;
	cache: boolean;
	compress: boolean;
	sourcemap: boolean;
};

export type PluginConstants = {
	eventPrefix: string;
	serviceWorker: {
		scriptPath: string;
		installedHeader: string;
		installPagePath: string;	
		installPageSources: string[];
	};
};

export type PluginHandler = {
	isModule: boolean | string[] | ((url: string) => boolean);
	isExternalServiceWorker: boolean;
};

export type PluginOptions<
	Variant extends TransportVariant = TransportVariant
> = {
	features: PluginFeatures;
	constants: PluginConstants;	
	transport: TransportConfig<Variant>;	
	handler: PluginHandler;
};

export const pluginName = __PLUGIN_NAME__;
export const pluginVersion = __PLUGIN_VERSION__;

export const defaultOptions: PluginOptions = {
	features: {
		cache: false,
		compress: false,
		prefetch: false,
		sourcemap: true,
	},	
	constants: {
		eventPrefix: 'hrm-over-ws',
		serviceWorker: {
			scriptPath: '/src/client/script',
			installedHeader: 'service-worker-powered',
			installPagePath: '/install-service-worker',
			installPageSources: [
				'/@vite/client',
				'/src/install.ts',
				'/node_modules/vite/dist/client/env.mjs',
				'/src/service-worker/sw.ts',
			],
		},
	},
	transport: {
		variant: TransportVariant.SOCKET_POOL,
		options: {
			path: '/ws/module',
			// THINK: does it needed at all here?
			origin: 'http://localhost:5173',
			poolAmount: 1,
		},
	},
	handler: {
		isModule: true,
		isExternalServiceWorker: false,
	},
};
