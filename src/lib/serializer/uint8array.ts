import { Serializer } from "./base";

export abstract class Uint8ArraySerialized<A> extends Serializer<A, Uint8Array> {
    protected encoder: TextEncoder;
    protected decoder: TextDecoder;

    constructor() {
        super();

        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }
}
