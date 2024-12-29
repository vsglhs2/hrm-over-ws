export function isObject(item: unknown) {
	return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(
	target: Record<string, unknown> = {},
	...sources: Record<string, unknown>[]
) {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeDeep(
                    target[key] as Record<string, unknown>,
                    source[key] as Record<string, unknown>,
				);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return mergeDeep(target, ...sources);
}
