
import type { UserConfig } from 'vite';

import type { TransportConfig} from '@/lib/transport/types';
import { TransportVariant } from '@/lib/transport/types';
import packageJson from '../package.json';

export type PluginFeatures = {
	prefetch: boolean;
	cache: boolean;
	compress: boolean;
	sourcemap: boolean;
};

export type PluginConstants = {
	pluginPath: string;
	baseUrl: string;
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

export type PluginSettings = {
	watch: boolean;
	log: number;
}

export type PluginOptions<
	Variant extends TransportVariant = TransportVariant
> = {
	features: PluginFeatures;
	constants: PluginConstants;
	transport: TransportConfig<Variant>;
	handler: PluginHandler;
	settings: PluginSettings;
};

export const pluginName = packageJson.name;
export const pluginVersion = packageJson.version;

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
		pluginPath: `node_modules/${pluginName}/dist`,
		baseUrl: '/',
		eventPrefix: 'hrm-over-ws',
		serviceWorker: {
			scriptPath: '/assets/script.js',
			installedHeader: 'service-worker-powered',
			installPagePath: '/install-service-worker',
			installPageSources: [
				'/@vite/client',
				'/node_modules/vite/dist/client/env.mjs',
				'/assets/install.js',
				'/assets/register.js',
				'/assets/script.js',
			],
		},
	},
	transport: {
		variant: TransportVariant.SOCKET_POOL,
		options: {
			path: `${config.base ?? '/'}ws/module`,
			origin: config.server?.origin ?? defaultOrigin,
			poolAmount: 1,
		},
	},
	handler: {
		isModule: true,
		isExternalServiceWorker: false,
	},
	settings: {
		log: 0,
		watch: false,
	},
});
