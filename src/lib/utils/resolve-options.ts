import { mergeDeep } from './merge-deep';
import type { RecursivePartial } from './types';

export function resolveOptions<Options extends Record<string, unknown>>(
	passedOptions: RecursivePartial<Options> | undefined,
	defaultOptions: Options,
) {
	return mergeDeep(defaultOptions, passedOptions ?? {}) as Options;
}
