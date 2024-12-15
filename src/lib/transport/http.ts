import { Transport, TransportOptions } from './base';

export type HttpFetchTransportOptions = TransportOptions;

export class HttpFetchTransport extends Transport {
	protected eventTarget: EventTarget;
	protected httpClient: typeof fetch;

	constructor(options: HttpFetchTransportOptions) {
		super(options);

		this.eventTarget = new EventTarget();
		this.httpClient = fetch;
	}

	public open() {}

	public close() {}

	// @ts-expect-error TODO: implement
	public send(type: string, payload: unknown) {
		// this.Http.emit(type, payload);
	}

	// @ts-expect-error TODO: implement
	public wait(type: string, callback: (payload: unknown) => void): void {
		// this.Http.on(type, payload => {
		//   this.Http.off(type, callback);
		//   callback(payload);
		// });
	}

	// @ts-expect-error TODO: implement
	public async sendAndWait(type: string, payload: unknown): Promise<unknown> {
		// return this.Http.emitWithAck(type, payload);
		return;
	}
}
