import { mergeDeep } from './merge-deep';
import { RecursivePartial } from './types';

export function resolveOptions<Options extends Record<string, unknown>>(
	passedOptions: RecursivePartial<Options> | undefined,
	defaultOptions: Options,
) {
	return mergeDeep(passedOptions, defaultOptions) as Options;
}
