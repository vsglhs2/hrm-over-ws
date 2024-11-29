export function createSocketServer(server: ViteDevServer, options: TransportOptions) {
	const io = new Server(server.httpServer!, {
		cors: {
			origin: '*',
		},
		path: options.path,
	});

	return io;
}
