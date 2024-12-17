import { Connect } from 'vite';
import { ServerResponse } from 'node:http';

import { ServerEnvironment } from '@/lib/environment/server';
import { readFileSync } from 'node:fs';
import path from 'node:path';
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
		req.headers['sec-fetch-dest'] === 'serviceworker') {
		return next();
	}

	if (req.url === installPagePath) {
		const resolvedPath = path.resolve(__dirname, '../../assets/install.html');
		const resolvedSourcePath = [
			'node_modules',
			pluginName,
			'dist/client/install.js'
		].join('/');

		const scriptString = readFileSync(resolvedPath, {
			encoding: 'utf-8',
		}).replace('<%--SCRIPT_SOURCE--%>', resolvedSourcePath);

		const transformedHtml = await this.server.transformIndexHtml(req.url, scriptString);

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
