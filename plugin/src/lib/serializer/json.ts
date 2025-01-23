import type { ReplacerFunction, ReviverFunction } from '../utils/json-transform-functions';
import { Uint8ArraySerialized } from './uint8array';

export type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

export type JsonSerializerOptions = {
    replacer?: ReplacerFunction;
    reviver?: ReviverFunction;
};

export class JsonSerializer<
    JSON extends JSONValue = JSONValue
> extends Uint8ArraySerialized<JSONValue> {
	protected readonly replacer?: ReplacerFunction;
	protected readonly reviver?: ReviverFunction;

	constructor({ replacer, reviver }: JsonSerializerOptions = {}) {
		super();

		this.replacer = replacer;
		this.reviver = reviver;
	}

	public serialize(json: JSON): Uint8Array {
		const stringified = JSON.stringify(json, this.replacer);

		return this.encoder.encode(stringified);
	}

	public deserialize(array: Uint8Array): JSON {
		const string = this.decoder.decode(array);

		return JSON.parse(string, this.reviver);
	}
}
