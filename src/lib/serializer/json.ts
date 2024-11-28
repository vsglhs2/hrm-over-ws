import { Uint8ArraySerialized } from "./uint8array";

export type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

export class JsonSerializer<
    JSON extends JSONValue = JSONValue
> extends Uint8ArraySerialized<JSONValue> {
    public serialize(json: JSON): Uint8Array {
        const stringified = JSON.stringify(json);

        return this.encoder.encode(stringified);
    }

    public deserialize(array: Uint8Array): JSON {
        const string = this.decoder.decode(array);

        return JSON.parse(string);
    }
}
