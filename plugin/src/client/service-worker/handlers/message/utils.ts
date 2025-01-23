export enum ServiceWorkerMessageType {
  NEGOTIATE,
};

type ServiceWorkerNegotiationMessage = {
  type: ServiceWorkerMessageType.NEGOTIATE;
}

export type ServiceWorkerMessage = ServiceWorkerNegotiationMessage;
