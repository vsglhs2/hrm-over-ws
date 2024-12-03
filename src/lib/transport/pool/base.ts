
import { Balancer } from './balancer';

import { TransportOptions, Transport } from '../base';

export type PoolTransportOptions = TransportOptions & {
    poolAmount: number;
};

export class PoolTransport extends Transport {
	private transports: Transport[];
	private balancer: Balancer;

	constructor(
		options: PoolTransportOptions,
		factory: (index: number) => Transport
	) {
		super(options);

		this.transports = [];
		this.balancer = new Balancer({
			max: options.poolAmount,
		});

		for (let i = 1; i <= options.poolAmount; i++) {
			const transport = factory(i);
			this.transports.push(transport);
		}
	}

	public open() {
		this.transports.forEach(transport => transport.open());
	}

	public close() {
		this.transports.forEach(transport => transport.close());
	}

	public send(type: string, payload: unknown) {
		const index = this.balancer.next();
		const transport = this.transports[index];
		console.log('# sended by: ', index);

		transport.send(type, payload);
	}

	public wait(type: string, callback: (payload: unknown) => void): void {
		const index = this.balancer.current();
		const transport = this.transports[index];
		console.log('# waited by: ', index);

		transport.wait(type, callback);
	}

	public async sendAndWait(type: string, payload: unknown): Promise<unknown> {
		const index = this.balancer.next();
		const transport = this.transports[index];
		console.log('# sended and waited by: ', index);

		return transport.sendAndWait(type, payload);
	}
}
