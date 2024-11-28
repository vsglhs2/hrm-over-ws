/**
 * Better use something else?
 */
export function isSameObject(
    a: Record<string, unknown>,
    b: Record<string, unknown>
) {
    return JSON.stringify(a) === JSON.stringify(b);
}
