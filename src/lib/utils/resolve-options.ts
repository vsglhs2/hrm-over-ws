import merge from 'lodash/merge';

import { RecursivePartial } from './types';

export function resolveOptions<Options extends Record<string, unknown>>(
	passedOptions: RecursivePartial<Options> | undefined,
	defaultOptions: Options
): Options {
	return merge(passedOptions, defaultOptions);
}
