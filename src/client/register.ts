import { PartialClientEnvironment } from '@/lib/environment/client';
import { ServiceWorkerMessageType } from './service-worker/handlers/message/utils';
import { PARTIAL_OPTIONS } from '@/lib/environment/client/partial';

if (import.meta.hot) {
	const environment = new PartialClientEnvironment(PARTIAL_OPTIONS);

	const { pluginPath, baseUrl, serviceWorker: { scriptPath } } = environment.options.constants;

	const url = new URL(pluginPath, location.href);
	url.pathname += scriptPath;

	const { installedHeader, installPagePath } = environment.options.constants.serviceWorker;

	const registrations = await navigator.serviceWorker.getRegistrations();
	if (!registrations.length) {
		document.cookie = `${installedHeader}=; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
	}

	if (!document.cookie.includes(installedHeader)) {
		for (const registration of registrations) {
			await registration.unregister();
		}

		const url = new URL(window.location.href);
		url.pathname = installPagePath;

		window.location.href = url.toString();
	}

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
	});
}

