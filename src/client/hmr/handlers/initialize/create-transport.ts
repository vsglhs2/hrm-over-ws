enum TransportVariant {
    SOCKET_POOL,
    SOCKET,
};

type VariantOptions<Variant extends TransportVariant> = {
    [TransportVariant.SOCKET]: TransportOptions;
    [TransportVariant.SOCKET_POOL]: PoolTransportOptions;
}[Variant];

function createTransport<const Variant extends TransportVariant>(
    variant: Variant,
    options: VariantOptions<Variant>
): Transport {
    if (variant === TransportVariant.SOCKET_POOL) return new PoolTransport(
        options as PoolTransportOptions,
        () => new SocketTransport(options),
    );

    return new SocketTransport(options);
}