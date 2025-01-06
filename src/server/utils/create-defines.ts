import { pluginName, pluginVersion } from '@/options';
import type { PluginOptions } from '@/options';

export function createDefines(options: PluginOptions) {
	return {
		__SERVICE_WORKER_INSTALLED_HEADER__:
			JSON.stringify(options.constants.serviceWorker.installedHeader),
		__SERVICE_WORKER_SCRIPT_PATH__:
			JSON.stringify(options.constants.serviceWorker.scriptPath),
		__SERVICE_WORKER_INSTALL_PAGE_PATH__:
			JSON.stringify(options.constants.serviceWorker.installPagePath),
		__SERVICE_WORKER_INSTALL_PAGE_SOURCES__:
			JSON.stringify(
				options.constants.serviceWorker.installPageSources,
			),
		__PLUGIN_VERSION__: JSON.stringify(pluginVersion),
		__PLUGIN_NAME__: JSON.stringify(pluginName),
		__EVENT_PREFIX__: JSON.stringify(options.constants.eventPrefix),
		__BASE_URL__: JSON.stringify(options.constants.baseUrl),
		__PLUGIN_PATH__: JSON.stringify(options.constants.pluginPath),
	};
}
