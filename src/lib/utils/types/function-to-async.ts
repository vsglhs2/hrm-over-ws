export type FunctionToAsync<Func extends (...args: any[]) => any> =
	(...args: Parameters<Func>) => Promise<Awaited<ReturnType<Func>>>;
