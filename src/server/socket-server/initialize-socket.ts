export function initializeSocket(server: ViteDevServer, io: Server, options: TransportOptions) {
	const responseSerializer = new ServerResponseSerializer();
	const requestSerializer = new RequestSerializer();

	io.on('connection', socket => {
		const socketAppendix = `${socket.id}`;

		console.log(`connected to ${socketAppendix}`);

		socket.on('disconnect', () => {
			console.log(`disconnected from ${socketAppendix}`);
		});

		socket.on(eventName('module'), );
	});
}