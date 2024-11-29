import { Connect, defineConfig, Plugin, ProxyOptions, ViteDevServer } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';
import { ServerResponse } from 'node:http';
import httpMocks, { RequestMethod } from 'node-mocks-http';
import { Server } from 'socket.io';
import { createEventNamer, RecursivePartial, resolveOptions } from "@/lib/utils";
import { TransportConfig, TransportVariant } from "@/lib/transport/types";
import merge from 'lodash/merge';
import { initializeSocketServer } from "./socket-server/initialize";

type PluginFeatures = {
	prefetch: boolean;
	cache: boolean;
	compress: boolean;
	sourcemap: boolean;
};

type PluginConstants = {
	eventPrefix: string;

	serviceWorkerInstalledHeader: string;
};

type PluginHandler = {
	isModule: boolean | string[] | ((url: string) => boolean);
};

type PluginOptions<
	Variant extends TransportVariant = TransportVariant
> = {
	features: PluginFeatures;
	constants: PluginConstants;	
	transport: TransportConfig<Variant>;	
	handler: PluginHandler;
};

export const eventPrefix = 'hrm-over-ws';
export const pluginName = 'vite-hrm-over-ws';

const SERVICE_WORKER_PATH = '/src/service-worker/sw';
const INSTALL_PAGE_PATH = '/install-service-worker';
const INSTALL_PAGE_INSTALLED_HEADER = 'service-worker-powered';
const INSTALL_PAGE_SOURCES = [
	'/@vite/client',
	'/src/install.ts',
	'/node_modules/vite/dist/client/env.mjs',
	'/src/service-worker/sw.ts',
	INSTALL_PAGE_PATH
];

const defaultOptions: PluginOptions = {
	features: {
		cache: false,
		compress: false,
		prefetch: false,
		sourcemap: true,
	},	
	constants: {
		eventPrefix: 'hrm-over-ws',
		serviceWorkerInstalledHeader: 'service-worker-powered',
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
	},
};

const eventName = createEventNamer(eventPrefix);

// install middleware
// allow service worker middleware
// fetch middleware



export function hrmOverSocketPlugin(
	options: Partial<PluginOptions> = defaultOptions
): Plugin {
	const resolvedOptions = resolveOptions(options, defaultOptions);

	return {
		name: 'hmr-plugin',

		configureServer(server) {
			if (!server.httpServer)
				throw new Error('Plugin need server.httpServer to run');

			initializeServer();
			initializeSocketServer();
			initializeHMR();
		},
	};
}