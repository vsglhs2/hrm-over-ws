/// <reference lib="webworker" />

import { ServiceWorkerEnvironment } from '@/lib/environment';
import { initializeHMR } from './hmr/initialize';
import { activateHandler, fetchHandler, handler, initializeServiceWorker, installHandler, messageHandler } from './service-worker';
import { PARTIAL_OPTIONS } from '@/lib/environment/client/partial';
import { initializationHandler, prefetchHandler } from './hmr';
import { BufferedHandler } from '@/lib/handler';

if (!import.meta.hot)
	throw Error('This service script must work only along with vite hmr');

const environment = new ServiceWorkerEnvironment({
	hot: import.meta.hot,
	serviceWorker: self as unknown as ServiceWorkerGlobalScope,
	// @ts-expect-error TODO: fix type when reconsider environments swap
	options: undefined,
	partialOptions: PARTIAL_OPTIONS,
	moduleHandler: new BufferedHandler(),
});

initializeHMR.call(environment, [
	// TODO: abstract handler logic, fix types
	// @ts-expect-error TODO: fix when refactor
	handler('initialization', initializationHandler),
	// @ts-expect-error TODO: fix when refactor
	handler('prefetch', prefetchHandler),
]);

initializeServiceWorker.call(environment, [
	handler('message', messageHandler),
	handler('fetch', fetchHandler),
	handler('install', installHandler),
	handler('activate', activateHandler),
]);
