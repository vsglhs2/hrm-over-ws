import { ServiceWorkerMessage, ServiceWorkerMessageType } from "./utils";

export const messageHandler = (event: ExtendableMessageEvent) => {
    const data = event.data as ServiceWorkerMessage;

    if (data.type !== ServiceWorkerMessageType.NEGOTIATE) return;

    hot.send(`${eventPrefix}:negotiate`);
    console.log('Send negotiation request');
}
