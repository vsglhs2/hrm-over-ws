import { ServiceWorkerMessageType } from './service-worker/handlers/message/utils';

if (import.meta.hot) {
	const baseUrl = import.meta.env.BASE_URL;
	const scriptUrl = baseUrl + __SERVICE_WORKER_SCRIPT_PATH__;

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

		document.cookie = `${__SERVICE_WORKER_INSTALLED_HEADER__}=${true};`;
		window.location.href = '/';
	});
}

