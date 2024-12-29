import type { ServerResponse } from 'node:http';
import httpMocks from 'node-mocks-http';

import { concatUInt8Arrays } from '@/lib/utils';
import type { ResponseJson} from './utils';
import { NUMBER_BYTES_LENGTH } from './utils';
import { JsonSerializer } from '../json';
import { NumberSerializer } from '../number';
import { Uint8ArraySerialized } from '../uint8array';

export class ServerResponseSerializer extends Uint8ArraySerialized<ServerResponse> {
	protected jsonSerializer: JsonSerializer<ResponseJson>;
	protected numberSerializer: NumberSerializer;

	constructor() {
		super();

		this.jsonSerializer = new JsonSerializer<ResponseJson>();
		this.numberSerializer = new NumberSerializer();
	}

	public async serialize(response: ServerResponse): Promise<Uint8Array> {
		const headers = response.getHeaders() as Record<string, string>;

		const json: ResponseJson = {
			url: response.req.url!,
			statusCode: response.statusCode,
			headers: headers,
		};

		const jsonArray = this.jsonSerializer.serialize(json);
		const jsonLengthArray = this.numberSerializer.serialize(jsonArray.byteLength);

		// @ts-expect-error TODO: find a way to retrieve data from response
		const bodyBuffer = this.encoder.encode(response._getData() as string);
		const bodyArray = new Uint8Array(bodyBuffer);

		return concatUInt8Arrays([jsonLengthArray, jsonArray, bodyArray]);
	}

	public deserialize(response: Uint8Array): ServerResponse {
		const jsonLengthArray = response.slice(0, NUMBER_BYTES_LENGTH);
		const jsonLength = this.numberSerializer.deserialize(jsonLengthArray);

		const jsonArray = response.slice(
			NUMBER_BYTES_LENGTH,
			jsonLength + NUMBER_BYTES_LENGTH,
		);
		const json: ResponseJson = this.jsonSerializer.deserialize(jsonArray);

		const bodyArray = response.slice(jsonArray.length + NUMBER_BYTES_LENGTH);
		const bodyBuffer = bodyArray.buffer;

		const res: ServerResponse = httpMocks.createResponse({
			req: httpMocks.createRequest(json),
		});
		res.statusCode = json.statusCode;
		res.setHeaders(new Headers(json.headers));
		res.end(bodyBuffer);

		return res;
	}
}
