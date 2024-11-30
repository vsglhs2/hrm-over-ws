export type ReplacerFunction = (this: any, key: string, value: any) => any;
export type ReviverFunction = (this: any, key: string, value: any) => any;

const FUNCTION_SIGN = 'FUNCTION';
const REPLACED_SIGN = '#';

function serializeFunction(fn: CallableFunction) {
    return `${FUNCTION_SIGN}${REPLACED_SIGN}${String(fn)}`;
}

/**
 * Maybe use more suitable approach?
 */
function deserializeFunction(fn: string) {
    const functionBody = `return (${fn})`;
    const compiledFunction = new Function(functionBody);

    return compiledFunction();
}

function isSerialized(target: string, serializeSign: string) {
    return target.includes(`${serializeSign}${REPLACED_SIGN}`);
}

export const replacerFunction: ReplacerFunction = function(_, value) {
    if (typeof value !== 'function') return;
    
    return serializeFunction(value);
}

export const reviverFunction: ReviverFunction = function(_, value) {
    if (
        typeof value !== 'string' ||
        !(isSerialized(value, FUNCTION_SIGN))
    ) return;

    return deserializeFunction(value)
}
