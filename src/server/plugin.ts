import { Plugin } from 'vite';

import { ServerEnvironment } from '@/lib/environment/server';
import { RecursivePartial, resolveOptions } from '@/lib/utils';
import { getDefaultOptions, pluginName, pluginVersion, PluginOptions } from '@/options';
import { initializeHMR } from './hmr';
import { initializeServer } from './middlewares/initialize';
import { initializeSocketServer } from './socket-server/initialize';
import { injectClientDefines } from './utils';

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
		},

		configureServer(server) {
			if (!server.httpServer)
				throw new Error('Plugin need server.httpServer to run');

			const environment = new ServerEnvironment({
				options: resolvedOptions,
				server,
			});

			const defineRecord = {
				__SERVICE_WORKER_INSTALLED_HEADER__:
					JSON.stringify(environment.options.constants.serviceWorker.installedHeader),
				__SERVICE_WORKER_SCRIPT_PATH__:
					JSON.stringify(environment.options.constants.serviceWorker.scriptPath),
				__SERVICE_WORKER_INSTALL_PAGE_PATH__:
					JSON.stringify(environment.options.constants.serviceWorker.installPagePath),
				__SERVICE_WORKER_INSTALL_PAGE_SOURCES__:
					JSON.stringify(
						environment.options.constants.serviceWorker.installPageSources
					),
				__PLUGIN_VERSION__: JSON.stringify(pluginVersion),
				__PLUGIN_NAME__: JSON.stringify(pluginName),
				__EVENT_PREFIX__: JSON.stringify(environment.options.constants.eventPrefix),
			};

			// transformWithEsbuild()

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
