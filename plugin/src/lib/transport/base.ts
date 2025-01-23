export type TransportOptions = {
    origin: string;
    path: string;
};

export abstract class Transport {
	protected origin: string;
	protected path: string;

	constructor(options: TransportOptions) {
		this.origin = options.origin;
		this.path = options.path;
	}

    public abstract open(): void;
    public abstract close(): void;
    public abstract send(type: string, payload: unknown): void;
    public abstract wait(type: string, callback: (payload: unknown) => void): void;
    public abstract sendAndWait(type: string, payload: unknown): Promise<unknown>;
}
