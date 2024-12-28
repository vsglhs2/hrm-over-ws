import { PartialClientEnvironment } from '@/lib/environment/client';
import { ServiceWorkerMessageType } from './service-worker/handlers/message/utils';
import { PARTIAL_OPTIONS } from '@/lib/environment/client/partial';

if (import.meta.hot) {
	const environment = new PartialClientEnvironment(PARTIAL_OPTIONS);

	const baseUrl = import.meta.env.BASE_URL;
	const scriptUrl = baseUrl + environment.options.constants.serviceWorker.scriptPath;

	const registrations = await navigator.serviceWorker.getRegistrations();
	if (!registrations.length) {
		document.cookie = `${environment.options.constants.serviceWorker.installedHeader}=; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
	}

	navigator.serviceWorker.register(scriptUrl, {
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
	});
}

