/// <reference lib="webworker" />

import { activateHandler, fetchHandler, handler, installHandler, messageHandler } from "./handlers";
import { initializeServiceWorker } from "./service-worker";

import { createStore } from "./service-worker/store";

if (!import.meta.hot)
  throw Error('This service script must work only along with vite hmr');

const eventPrefix = 'hmr';
const store = createStore();

const { hot } = import.meta;
hot.accept();

hot.dispose(() => store.handler.close());

hot.on(`${eventPrefix}:initialize`, initializationHandler);

hot.on(`${eventPrefix}:modules`, prefetchHandler);

const sw = self as unknown as ServiceWorkerGlobalScope;

initializeServiceWorker(sw, [
  handler('message', messageHandler),
  handler('fetch', fetchHandler),
  handler('install', installHandler),
  handler('activate', activateHandler),
]);