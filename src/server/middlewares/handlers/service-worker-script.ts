export function createServiceWorkerScriptMiddleware() {
	return (
		req: Connect.IncomingMessage,
		res: ServerResponse,
		next: Connect.NextFunction
	) => {
		const url = req.originalUrl;

		if (url && url.includes(SERVICE_WORKER_PATH)) {
			res.setHeader("Service-Worker-Allowed", "/");
			res.setHeader("Content-Type", "text/javascript");
		}

		next();
	};
}