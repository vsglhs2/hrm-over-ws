import { TransportVariant, TransportConfig } from '@/lib/transport/types';
import { UserConfig } from 'vite';

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

const defaultHost = 'localhost';
const defaultPort = 5173;
const defaultProtocol = 'http';
const defaultOrigin = `${defaultProtocol}://${defaultHost}:${defaultPort}`;

export const getDefaultOptions = (config: UserConfig): PluginOptions => ({
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
			path: `${config.base}ws/module`,
			origin: config.server?.origin ?? defaultOrigin,
			poolAmount: 1,
		},
	},
	handler: {
		isModule: true,
		isExternalServiceWorker: false,
	},
});
