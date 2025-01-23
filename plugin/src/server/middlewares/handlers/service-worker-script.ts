import type { Connect } from 'vite';
import type { ServerResponse } from 'node:http';

import type { ServerEnvironment } from '@/lib/environment/server';

export function serviceWorkerScriptMiddleware(
	this: ServerEnvironment,
	req: Connect.IncomingMessage,
	res: ServerResponse,
	next: Connect.NextFunction,
) {
	const url = req.originalUrl;

	if (url && url.includes(this.options.constants.serviceWorker.scriptPath)) {
		res.setHeader('Service-Worker-Allowed', '/');
		res.setHeader('Content-Type', 'text/javascript');
	}

	next();
};
