import { RequestHandler } from './base';

const BUFFERED_REQUEST_TIMEOUT = 10_000;

export class BufferedHandler extends RequestHandler {
	protected buffer: Request[];
	protected eventTarget: EventTarget;

	constructor() {
		super();

		this.buffer = [];
		this.eventTarget = new EventTarget();
	}

	public transfer(callback: (request: Request) => Promise<Response>) {
		for (const request of this.buffer) {
			callback(request).then(response => {
				const event = new CustomEvent('process', {
					detail: {
						request: request,
						response: response
					}
				});

				this.eventTarget.dispatchEvent(event);
			});
		}
	}

	public process(request: Request) {
		const controller = new AbortController();
		this.buffer.push(request);

		return new Promise<Response>((resolve) => {
			this.eventTarget.addEventListener('process', e => {
				const { detail } = e as CustomEvent<{ request: Request, response: Response }>;
				if (request !== detail.request) return;

				resolve(detail.response);
				controller.abort();
			});

			setTimeout(() => {
				controller.abort(`Timeout for ${request.url} request`);
			}, BUFFERED_REQUEST_TIMEOUT);

			controller.signal.onabort = () => {
				const response = new Response(controller.signal.reason, {
					status: 404
				});

				resolve(response);
			};
		});
	}
}
