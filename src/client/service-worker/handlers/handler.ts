import { ServiceWorkerEnvironment } from '@/lib/environment/client';

export type ServiceWorkerHandler<
    Type extends keyof ServiceWorkerGlobalScopeEventMap
    = keyof ServiceWorkerGlobalScopeEventMap
> = {
    type: Type;
    listener: (
        this: ServiceWorkerEnvironment,
        ev: ServiceWorkerGlobalScopeEventMap[Type]
    ) => unknown;
    options?: boolean | AddEventListenerOptions;
};

/**
 * THINK: Is it necessary?
 */
export const handler = <
    Type extends keyof ServiceWorkerGlobalScopeEventMap
    = keyof ServiceWorkerGlobalScopeEventMap
>(
		type: Type,
		listener: ServiceWorkerHandler<Type>['listener'],
		options?: ServiceWorkerHandler<Type>['options'],
	): ServiceWorkerHandler => ({
		type: type,
		listener: listener as unknown as (
            this: ServiceWorkerEnvironment,
            e: Event
        ) => void,
		options: options,
	});
