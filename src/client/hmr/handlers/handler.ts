export type HMRHandler<
    Type extends keyof ViteHotContext
    = keyof ViteHotContext
> = {
    type: Type;
    listener: (
        this: ViteHotContext,
        ev: ViteHotContext[Type]
    ) => unknown;
};

/**
 * THINK: Is it necessary?
 */
export const handler = <
    Type extends keyof ViteHotContext
    = keyof ViteHotContext
>(
		type: Type,
		listener: HMRHandler<Type>['listener']
	): HMRHandler => ({
		type: type,
		listener: listener as unknown as (e: Event) => void
	});
