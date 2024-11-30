import { ServerEnvironment, SocketEnvironment } from "@/lib/environment";
import { createSocketServer } from "./create-socket-server";
import { moduleHandler } from "./handlers";

export function initializeSocketServer(this: ServerEnvironment) {
    const io = createSocketServer.call(this);

	io.on('connection', socket => {
		const socketAppendix = `${socket.id}`;

		console.log(`connected to ${socketAppendix}`);

		socket.on('disconnect', () => {
			console.log(`disconnected from ${socketAppendix}`);
		});

		const environment = new SocketEnvironment({
			...this,
			io: io,
			socketAppendix: socketAppendix,
		})

		socket.on(this.eventName('module'), moduleHandler.bind(environment));
	});
}
