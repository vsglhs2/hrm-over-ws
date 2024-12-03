import { Connect } from 'vite';
import { ServerResponse } from 'node:http';

import { ServerEnvironment } from '@/lib/environment';

export function installMiddleware(this: ServerEnvironment,
	req: Connect.IncomingMessage,
	res: ServerResponse,
	next: Connect.NextFunction,
) {
	const {
		installedHeader,
		installPageSources,
		installPagePath,
	} = this.options.constants.serviceWorker;

	if (
		req.headers.cookie?.includes(installedHeader) ||
		req.url !== '/' && installPageSources.some(
			url => req.url && (url.includes(req.url) || req.url.includes(url)),
		) ||
		req.headers['sec-fetch-dest'] === 'serviceworker'
	) {
		return next();
	}

	res.writeHead(302, {
		'location': installPagePath,
	});
	res.end();

	console.log('redirected to install page');
}
