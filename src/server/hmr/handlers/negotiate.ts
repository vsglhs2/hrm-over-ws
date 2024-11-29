export function negotiateHandler() {
    console.log('Got negotiation request')
    server.ws.send(`${eventPrefix}:initialize`, resolvedOptions);

    const moduleUrls = Array.from(server.moduleGraph.urlToModuleMap.keys());
    server.ws.send(`${eventPrefix}:modules`, moduleUrls);

}