import type { Socket} from 'socket.io-client';
import { io } from 'socket.io-client';

import type { TransportOptions} from './base';
import { Transport } from './base';

export type SocketTransportOptions = TransportOptions;

export class SocketTransport extends Transport {
	protected socket: Socket;

	constructor(options: SocketTransportOptions) {
		super(options);

		const ioAppendix = `${options.path}`;
		const socket = this.socket = io(options.origin, {
			transports: ['websocket'],
			path: ioAppendix,
		});

		socket.on('connect', () => {
			console.log(`connected to ${ioAppendix}`);
		});

		socket.on('disconnect', (reason) => {
			console.log(`disconnected from ${ioAppendix}:`, reason);
		});

		socket.on('error', (error) => console.error(`error on ${ioAppendix}`, error));
	}

	public open() {
		this.socket.connect();
	}

	public close() {
		this.socket.close();
	}

	public send(type: string, payload: unknown) {
		this.socket.emit(type, payload);
	}

	public wait(type: string, callback: (payload: unknown) => void): void {
		this.socket.on(type, payload => {
			this.socket.off(type, callback);

			callback(payload);
		});
	}

	public async sendAndWait(type: string, payload: unknown): Promise<unknown> {
		return this.socket.emitWithAck(type, payload);
	}
}
