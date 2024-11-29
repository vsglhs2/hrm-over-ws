export function initializeSocketServer() {
    const io = createSocketServer(server, resolvedOptions.options);

    const socketsAmount =
        resolvedOptions.variant === TransportVariant.SOCKET_POOL
            ? (resolvedOptions.options as PoolTransportOptions).poolAmount
            : 1;

    const socketPath = resolvedOptions.options.path;
    const host = server.config.server.host ?? 'localhost';
    const port = server.config.server.port ?? 5173;
    const origin = `http://${host}:${port}`;

    for (let i = 1; i <= socketsAmount; i++) {
        initializeSocket(server, io, {
            origin: origin,
            path: socketPath,
        });
    }
}