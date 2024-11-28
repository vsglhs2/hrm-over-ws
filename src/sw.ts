enum ServiceWorkerMessageType {
    NEGOTIATE,
};

type ServiceWorkerNegotiationMessage = {
    type: ServiceWorkerMessageType.NEGOTIATE;
}

type ServiceWorkerMessage = ServiceWorkerNegotiationMessage;

if (import.meta.hot && navigator.serviceWorker) {
    const INSTALL_PAGE_INSTALLED_HEADER = 'service-worker-powered';

    const baseUrl = import.meta.env.BASE_URL;
    const scriptUrl = baseUrl + 'src/service-worker/sw.ts';

    const registrations = await navigator.serviceWorker.getRegistrations();
    if (!registrations.length) {
        document.cookie = `${INSTALL_PAGE_INSTALLED_HEADER}=; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
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

