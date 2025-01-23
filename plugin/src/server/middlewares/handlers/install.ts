import type { Connect  } from 'vite';
import type { ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import type { ServerEnvironment } from '@/lib/environment/server';
import { pluginName } from '@/options';

export async function installMiddleware(this: ServerEnvironment,
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

	if (req.url === installPagePath) {
		const resolvedPath = path.resolve(__dirname, './assets/install.html');
		const resolvedStringPath = [
			'node_modules',
			pluginName,
			'dist/assets/install.js',
		].join('/');

		const pageString = readFileSync(resolvedPath, {
			encoding: 'utf-8',
		}).replace('<%--SCRIPT_SOURCE--%>', resolvedStringPath);

		const transformedHtml = await this.server.transformIndexHtml(req.url, pageString);

		res.setHeader('content-type', 'text/html');
		res.write(transformedHtml);

		return res.end();
	}

	res.writeHead(302, {
		'location': installPagePath,
	});
	res.end();

	console.log('redirected to install page');
}
