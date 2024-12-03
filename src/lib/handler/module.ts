import { Transport } from '@/lib/transport';

import { RequestHandler } from './base';

export class TransportModuleHandler extends RequestHandler {
	protected transport: Transport;

	constructor(transport: Transport) {
		super();

		this.transport = transport;
		this.transport.open();
	}

	public async process(request: Request) {
		// const REQUEST_TIMEOUT_DELAY = 100_000;

		try {
			const serialized = this.requestSerializer.serialize(request);
			const response = await this.transport.sendAndWait(
				'module',
				serialized
			) as ArrayBuffer;

			return this.responseSerializer.deserialize(new Uint8Array(response));
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
