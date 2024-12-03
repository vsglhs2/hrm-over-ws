import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [tsconfigPaths()],
	define: {
		__PLUGIN_VERSION__: JSON.stringify(process.env.npm_package_version),
		__PLUGIN_NAME__: JSON.stringify(process.env.npm_package_name),
	},
	esbuild: {
		target: 'es2020',
		supported: {
			'top-level-await': true,
		},
	},
});
