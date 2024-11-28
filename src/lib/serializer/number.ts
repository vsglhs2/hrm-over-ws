import { Uint8ArraySerialized } from "./uint8array";

export class NumberSerializer extends Uint8ArraySerialized<number> {
    public serialize(number: number): Uint8Array {
        const { buffer } = new Float64Array([number]);

        return new Uint8Array(buffer);
    }

    public deserialize(array: Uint8Array): number {
        const { buffer } = array;

        return new Float64Array(buffer)[0];
    }
}