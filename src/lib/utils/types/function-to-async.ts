export type FunctionToAsync<Func extends (...args: unknown[]) => unknown> =
	(...args: Parameters<Func>) => Promise<Awaited<ReturnType<Func>>>;
