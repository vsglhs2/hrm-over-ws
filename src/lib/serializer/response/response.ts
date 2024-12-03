
import { getHeadersRecord, concatUInt8Arrays } from '@/lib/utils';

import { NUMBER_BYTES_LENGTH, ResponseJson } from './utils';

import { JsonSerializer } from '../json';
import { NumberSerializer } from '../number';
import { Uint8ArraySerialized } from '../uint8array';

export class ResponseSerializer extends Uint8ArraySerialized<Response> {
	protected jsonSerializer: JsonSerializer<ResponseJson>;
	protected numberSerializer: NumberSerializer;

	constructor() {
		super();

		this.jsonSerializer = new JsonSerializer<ResponseJson>();
		this.numberSerializer = new NumberSerializer();
	}

	public async serialize(response: Response): Promise<Uint8Array> {
		const headers = getHeadersRecord(response.headers);

		const json: ResponseJson = {
			url: response.url,
			statusCode: response.status,
			headers: headers,
		};

		const jsonArray = this.jsonSerializer.serialize(json);

		// Always NUMBER_BYTES_LENGTH bytes
		const jsonLengthArray = this.numberSerializer.serialize(jsonArray.byteLength);
		if (jsonLengthArray.byteLength !== NUMBER_BYTES_LENGTH)
			throw new Error('Incorrect number was passed: ' + jsonArray.byteLength);

		const bodyBuffer = await response.arrayBuffer();
		const bodyArray = new Uint8Array(bodyBuffer);

		return concatUInt8Arrays([jsonLengthArray, jsonArray, bodyArray]);
	}

	public deserialize(response: Uint8Array): Response {
		const jsonLengthArray = response.slice(0, NUMBER_BYTES_LENGTH);
		const jsonLength = this.numberSerializer.deserialize(jsonLengthArray);

		const jsonArray = response.slice(
			NUMBER_BYTES_LENGTH,
			jsonLength + NUMBER_BYTES_LENGTH
		);
		const json: ResponseJson = this.jsonSerializer.deserialize(jsonArray);

		const bodyArray = response.slice(jsonArray.length + NUMBER_BYTES_LENGTH);
		const bodyBuffer = bodyArray.buffer;

		return new Response(bodyBuffer, json);
	}
}
