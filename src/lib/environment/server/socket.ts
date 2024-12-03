import { Server } from 'socket.io';

import { RequestSerializer, ServerResponseSerializer } from '@/lib/serializer';
import { ServerEnvironment } from '..';

type SocketEnvironmentOptions = ServerEnvironment & {
    io: Server;
    socketAppendix: string;
};

export class SocketEnvironment extends ServerEnvironment {
	public readonly io: Server;
	public readonly socketAppendix: string;
	public readonly serializers: {
        readonly request: RequestSerializer;
        readonly response: ServerResponseSerializer;
    };

	constructor({
		options,
		socketAppendix,
		io, server,
	}: SocketEnvironmentOptions) {
		super({ options, server });

		this.io = io;
		this.socketAppendix = socketAppendix;

		this.serializers = {
			request: new RequestSerializer(),
			response: new ServerResponseSerializer(),
		};
	}
}
