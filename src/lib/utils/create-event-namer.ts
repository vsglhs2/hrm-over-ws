export function createEventNamer<Prefix extends string>(prefix: Prefix) {
	const resolvedPrefix = prefix ? `${prefix}:` : '';
	type ResolvedPrefix<Name extends string> =
		`${Prefix extends '' ? '' : `${Prefix}:`}${Name}`;

	return (
        <Name extends string>(name: Name) =>
			(resolvedPrefix + name) as ResolvedPrefix<Name>
	);
}

export type EventNamer<Prefix extends string = string> =
	ReturnType<typeof createEventNamer<Prefix>>;
