import { PartialClientEnvironment } from '@/lib/environment/client';
import { ServiceWorkerMessageType } from './service-worker/handlers/message/utils';
import { PARTIAL_OPTIONS } from '@/lib/environment/client/partial';

if (import.meta.hot) {
	const environment = new PartialClientEnvironment(PARTIAL_OPTIONS);

	// TODO: move cookie management here
	// function setCookie() {

	// }

	// function getCookie() {

	// }

	const { pluginPath, baseUrl, serviceWorker: { scriptPath } } = environment.options.constants;

	const url = new URL(pluginPath, location.href);
	url.pathname += scriptPath;

	navigator.serviceWorker.register(url, {
		scope: baseUrl,
		type: 'module',
	})
		.then(registration => {
			console.log('Service Worker registered with scope:', registration.scope);
		})
		.catch(error => {
			console.error('Service Worker registration failed:', error);
		});

	await navigator.serviceWorker.ready.then(registration => {
		if (!registration.active) {
			console.error('Service worker is not active');
			return;
		}

		registration.active.postMessage({
			type: ServiceWorkerMessageType.NEGOTIATE,
		});

		document.cookie = `${environment.options.constants.serviceWorker.installedHeader}=${true};`;
		window.location.href = '/';
	});
}
