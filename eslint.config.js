import js from '@eslint/js';
import stylisticJsPlugin from '@stylistic/eslint-plugin-js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
	js.configs.recommended,
	...ts.configs.recommended,
	{
		languageOptions: { globals: globals.browser },
		plugins: {
			'@stylistic/js': stylisticJsPlugin,
			'import': importPlugin,
		},
		files: ['**/*.{js,mjs,cjs,ts,d.ts}'],
		ignores: ['node_modules/*', 'dist/*', 'build/*'],
		rules: {
			'@stylistic/js/eol-last': ['error', 'always'],
			'@stylistic/js/no-trailing-spaces': ['error'],
			'@stylistic/js/comma-dangle': ['error', 'always-multiline'],

			'eqeqeq': ['error', 'allow-null'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'indent': ['warn', 'tab'],

			'@typescript-eslint/no-unused-vars': 'warn',

			'import/order': [
				'error',
				{
					groups: [
						['builtin', 'external'],
					],
					'newlines-between': 'always',
				},
			],
		},
	},
];
