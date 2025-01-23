import type { Transport } from '@/lib/transport';
import { RequestHandler } from './base';
import type { EventNamer } from '../utils/create-event-namer';

type TransportModuleHandlerOptions = {
	eventName: EventNamer;
};

export class TransportModuleHandler extends RequestHandler {
	protected transport: Transport;
	protected eventName: EventNamer;

	constructor(transport: Transport, options: TransportModuleHandlerOptions) {
		super();

		this.transport = transport;
		this.transport.open();

		this.eventName = options.eventName;
	}

	public async process(request: Request) {
		// const REQUEST_TIMEOUT_DELAY = 100_000;

		try {
			const serialized = this.requestSerializer.serialize(request);
			const response = await this.transport.sendAndWait(
				this.eventName('module'),
				serialized,
			) as ArrayBuffer;

			const deserializedResponse = this.responseSerializer.deserialize(new Uint8Array(response));
			console.log('Got response:', deserializedResponse.status, request.url, performance.now());

			return deserializedResponse;
		} catch (err) {
			const error = err instanceof Error
				? err
				: new Error(`Unknown error: ${String(err)}`);

			return new Response(error.message, {
				status: 404,
			});
		}
	}

	public close(): void {
		this.transport.close();
	}
}
