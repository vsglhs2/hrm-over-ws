export function concatUInt8Arrays(arrays: Uint8Array[]) {
    const length = arrays.reduce((length, array) => array.byteLength + length, 0);
    const output = new Uint8Array(length);

    let offset = 0;
    for (let i = 0; i < arrays.length; i++) {
        output.set(arrays[i], offset);

        offset += arrays[i].byteLength;
    }

    return output;
}
