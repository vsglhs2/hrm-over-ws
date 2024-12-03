import { Server } from 'socket.io';

import { ServerEnvironment } from '@/lib/environment';

export function createSocketServer(this: ServerEnvironment) {
	const io = new Server(this.server.httpServer!, {
		cors: {
			origin: '*',
		},
		path: this.options.transport.options.path,
	});

	return io;
}
