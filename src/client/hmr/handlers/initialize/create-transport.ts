import type { Transport } from '@/lib/transport';
import { PoolTransport, SocketTransport } from '@/lib/transport';
import type { PoolTransportOptions } from '@/lib/transport/pool/base';
import type { VariantOptions } from '@/lib/transport/types';
import { TransportVariant } from '@/lib/transport/types';

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
