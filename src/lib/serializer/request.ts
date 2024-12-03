import { JsonSerializer } from './json';
import { Uint8ArraySerialized } from './uint8array';

// TODO: pass to request and response serializers as options

const TARGET_HEADERS = [
	'if-none-match',
	'sec-fetch-dest',
	'accept'
];

export type RequestJson = {
    url: string;
    method: string;
    headers: Record<string, string>;
};

export class RequestSerializer extends Uint8ArraySerialized<Request> {
	protected jsonSerializer: JsonSerializer<RequestJson>;

	constructor() {
		super();

		this.jsonSerializer = new JsonSerializer<RequestJson>();
	}

	public serialize(request: Request): Uint8Array {
		const url = request.url;
		const headers: Record<string, string> = {};

		for (const header of TARGET_HEADERS) {
			if (!request.headers.has(header)) continue;

			headers[header] = request.headers.get(header)!;
		}

		const json: RequestJson = {
			url: url,
			method: request.method,
			headers: headers
		};

		return this.jsonSerializer.serialize(json);
	}

	public deserialize(request: Uint8Array): Request {
		const json = this.jsonSerializer.deserialize(request);

		return new Request(json.url, {
			method: json.method,
			headers: json.headers
		});
	}
}
