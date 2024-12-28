import { Plugin } from 'vite';

import { ServerEnvironment } from '@/lib/environment/server';
import { RecursivePartial, resolveOptions } from '@/lib/utils';
import { getDefaultOptions, pluginName, pluginVersion, PluginOptions } from '@/options';
import { initializeHMR } from './hmr';
import { initializeServer } from './middlewares/initialize';
import { initializeSocketServer } from './socket-server/initialize';
import { createDefines, injectClientDefines } from './utils';

export default function hrmOverSocketPlugin(
	options: RecursivePartial<PluginOptions> = {},
): Plugin {
	let resolvedOptions: PluginOptions;

	return {
		name: pluginName,
		version: pluginVersion,

		apply: 'serve',
		enforce: 'post',

		config(config) {
			const defaultOptions = getDefaultOptions(config);
			resolvedOptions = resolveOptions(options, defaultOptions);
		},

		configureServer(server) {
			if (!server.httpServer)
				throw new Error('Plugin need server.httpServer to run');

			const environment = new ServerEnvironment({
				options: resolvedOptions,
				server,
			});

			const defineRecord = createDefines(environment);
			injectClientDefines(defineRecord);
			initializeServer.call(environment);
			initializeSocketServer.call(environment);
			initializeHMR.call(environment);
		},
	};
}

export type {
	PluginOptions as HRMOverSocketPluginOptions,
};
