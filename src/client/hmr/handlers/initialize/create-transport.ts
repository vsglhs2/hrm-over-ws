import { PoolTransport, SocketTransport, Transport } from '@/lib/transport';
import { PoolTransportOptions } from '@/lib/transport/pool/base';
import { TransportVariant, VariantOptions } from '@/lib/transport/types';

export function createTransport<const Variant extends TransportVariant>(
	variant: Variant,
	options: VariantOptions<Variant>,
): Transport {
	if (variant === TransportVariant.SOCKET_POOL)
		return new PoolTransport(
			options as PoolTransportOptions,
			() => new SocketTransport(options),
		);

	return new SocketTransport(options);
}
