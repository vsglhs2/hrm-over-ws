export function createEventNamer<Prefix extends string>(prefix: Prefix) {
    const resolvedPrefix = prefix ? `${prefix}:` : '';

    return (
        <Name extends string>(name: Name)  => (resolvedPrefix + name) as `${Prefix}:${Name}`
    );
}
