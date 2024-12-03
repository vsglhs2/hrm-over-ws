import { ServerEnvironment } from '@/lib/environment';
import { resolveOptions } from '@/lib/utils';
import { getDefaultOptions, pluginName, PluginOptions } from '@/options';
import { Plugin } from 'vite';
import { initializeHMR } from './hmr';
import { initializeServer } from './middlewares/initialize';
import { initializeSocketServer } from './socket-server/initialize';

const packageVersion = JSON.stringify(process.env.npm_package_version);
const packageName = JSON.stringify(process.env.npm_package_name);

export default function hrmOverSocketPlugin(
	options?: Partial<PluginOptions>
): Plugin {
	let resolvedOptions: PluginOptions;

	return {
		name: pluginName,
		apply: 'serve',
		version: packageVersion,

		config(config) {
			const defaultOptions = getDefaultOptions(config);
			resolvedOptions = resolveOptions(options, defaultOptions);

			return {
				define: {
					__SERVICE_WORKER_INSTALLED_HEADER__:
						resolvedOptions.constants.serviceWorker.installedHeader,
					__SERVICE_WORKER_SCRIPT_PATH__:
						resolvedOptions.constants.serviceWorker.scriptPath,
					__PLUGIN_VERSION__: packageVersion,
					__PLUGIN_NAME__: packageName,
					__EVENT_PREFIX__: resolvedOptions.constants.eventPrefix,
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

			initializeServer.call(environment);
			initializeSocketServer.call(environment);
			initializeHMR.call(environment);
		},
	};
}
