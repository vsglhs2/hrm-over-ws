import { Plugin } from 'vite';

import { ServerEnvironment } from '@/lib/environment/server';
import { RecursivePartial, resolveOptions } from '@/lib/utils';
import { getDefaultOptions, pluginName, pluginVersion, PluginOptions } from '@/options';
import { initializeHMR } from './hmr';
import { initializeServer } from './middlewares/initialize';
import { initializeSocketServer } from './socket-server/initialize';

export default function hrmOverSocketPlugin(
	options: RecursivePartial<PluginOptions> = {},
): Plugin {
	let resolvedOptions: PluginOptions;

	return {
		name: pluginName,
		apply: 'serve',
		version: pluginVersion,

		config(config) {
			const defaultOptions = getDefaultOptions(config);
			resolvedOptions = resolveOptions(options, defaultOptions);

			return {
				define: {
					__SERVICE_WORKER_INSTALLED_HEADER__:
						JSON.stringify(resolvedOptions.constants.serviceWorker.installedHeader),
					__SERVICE_WORKER_SCRIPT_PATH__:
						JSON.stringify(resolvedOptions.constants.serviceWorker.scriptPath),
					__SERVICE_WORKER_INSTALL_PAGE_PATH__:
						JSON.stringify(resolvedOptions.constants.serviceWorker.installPagePath),
					__SERVICE_WORKER_INSTALL_PAGE_SOURCES___:
						JSON.stringify(resolvedOptions.constants.serviceWorker.installPageSources),
					__PLUGIN_VERSION__: JSON.stringify(pluginVersion),
					__PLUGIN_NAME__: JSON.stringify(pluginName),
					__EVENT_PREFIX__: JSON.stringify(resolvedOptions.constants.eventPrefix),
				},
			};
		},

		configureServer(server) {
			if (!server.httpServer)
				throw new Error('Plugin need server.httpServer to run');

			const environment = new ServerEnvironment({
				options: resolvedOptions,
				server,
			});

			console.log('resolved options:', environment.options)

			initializeServer.call(environment);
			initializeSocketServer.call(environment);
			initializeHMR.call(environment);
		},
	};
}

export type {
	PluginOptions as HRMOverSocketPluginOptions,
};
