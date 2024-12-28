import { ServerEnvironment } from '@/lib/environment/server';
import { installMiddleware, serviceWorkerScriptMiddleware } from './handlers';
import { pluginName } from '@/options';

export function initializeServerMiddlewares(this: ServerEnvironment) {
	this.server.middlewares.use(installMiddleware.bind(this));
	this.server.middlewares.use(serviceWorkerScriptMiddleware.bind(this));
}

function setupWatch(environment: ServerEnvironment) {
	environment.server.watcher.options = {
		...environment.server.watcher.options,
		ignored: [
			new RegExp(`node_modules\/(?!${pluginName}).*`),
			'**/.git/**',
		],
	};

	environment.server.watcher.on('all', (_, filename) => {
		console.log(filename);
	});
}

export function initializeServer(this: ServerEnvironment) {
	if (this.options.settings.watch) {
		setupWatch(this);
	}

	initializeServerMiddlewares.call(this);
}
