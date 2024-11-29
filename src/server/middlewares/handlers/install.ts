export function createInstallMiddleware() {
	return (
		req: Connect.IncomingMessage,
		res: ServerResponse,
		next: Connect.NextFunction
	) => {
		if (
			req.headers.cookie?.includes(INSTALL_PAGE_INSTALLED_HEADER) ||
			req.url !== '/' && INSTALL_PAGE_SOURCES.some(
				url => req.url && (url.includes(req.url) || req.url.includes(url))
			) ||
			req.headers['sec-fetch-dest'] === 'serviceworker'
		) {
			return next();
		}

		res.writeHead(302, {
			'location': INSTALL_PAGE_PATH,
		});
		res.end();

		console.log('redirected to install page');
	};
}