import { TransportOptions } from './base';
import { HttpFetchTransportOptions } from './http';
import { PoolTransportOptions } from './pool/base';

export enum TransportVariant {
	SOCKET_POOL,
	SOCKET,
	HTTP_FETCH,
};

export type VariantOptions<Variant extends TransportVariant> = {
	[TransportVariant.SOCKET]: TransportOptions;
	[TransportVariant.SOCKET_POOL]: PoolTransportOptions;
	[TransportVariant.HTTP_FETCH]: HttpFetchTransportOptions;
}[Variant];

export type TransportConfig<Variant extends TransportVariant> = {
	variant: Variant;
	options: VariantOptions<Variant>;
};
