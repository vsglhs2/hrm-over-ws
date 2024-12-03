import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
	js.configs.recommended,
	...ts.configs.recommended,
	{
		languageOptions: { globals: globals.browser },
		plugins: {
			'@stylistic/js': stylisticJs
		},
		files: ['**/*.{js,mjs,cjs,ts}'],
		ignores: ['node_modules/*'],
		rules: {
			'@stylistic/js/eol-last': ['error', 'always'],
			'@stylistic/js/no-trailing-spaces': ['error'],
			'eqeqeq': ['error', 'allow-null'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'indent': ['warn', 'tab']
		},
	},
];
