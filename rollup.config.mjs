import nodeResolve from "@rollup/plugin-node-resolve";
import cjs from '@rollup/plugin-commonjs';

export default {
    input: 'dist/client/src/client/script.js',
    output: {
        file: 'dist/client/script.js',
        format: 'es',
    },
    plugins: [nodeResolve({ modulesOnly: true, browser: true }), cjs()],
};
