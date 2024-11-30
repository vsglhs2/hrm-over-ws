import { Plugin } from "vite";
import { resolveOptions } from "@/lib/utils";
import { initializeSocketServer } from "./socket-server/initialize";
import { defaultOptions, pluginName, PluginOptions } from "@/options";
import { ServerEnvironment } from "@/lib/environment/server";

export function hrmOverSocketPlugin(
	options: Partial<PluginOptions> = defaultOptions
): Plugin {
	const resolvedOptions = resolveOptions(options, defaultOptions);

	return {
		name: pluginName,

		configResolved(config) {
			// TODO: use config to alter default options
		},

		configureServer(server) {
			const environment = new ServerEnvironment({
				options: resolvedOptions,
				server,
			});

			if (!server.httpServer)
				throw new Error('Plugin need server.httpServer to run');

			initializeServer();
			initializeSocketServer();
			initializeHMR();
		},
	};
}