const { promise, resolve } = Promise.withResolvers();

export const prefetchHandler = (moduleUrls: string[]) => {
	console.log('Modules list: ', moduleUrls);

	const promises = moduleUrls.map(moduleUrl => {
		console.log('fetch: ', moduleUrl);
		return store.handler.request(new Request(moduleUrl), {
			reuse: true,
		});
	});

	resolve(undefined);
	// resolve(promises[promises.length - 1]);
};
