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

const DEFAULT_WEBSOCKET_PATH = '/ws/module';
const DEFAULT_WEBSOCKET_ORIGIN = 'http://localhost:5173';