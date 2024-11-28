export const activateHandler = (event: ExtendableEvent) => {
    // console.log('activate');
    event.waitUntil(sw.clients.claim());
}