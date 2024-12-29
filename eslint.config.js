/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const js = require('@eslint/js');
const stylisticJsPlugin = require('@stylistic/eslint-plugin-js');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');
const ts = require('typescript-eslint');

module.exports = [
	js.configs.recommended,
	...ts.configs.recommended,
	{
		languageOptions: { globals: globals.browser },
		plugins: {
			'@stylistic/js': stylisticJsPlugin,
			'import': importPlugin,
		},
		files: ['**/*.{js,mjs,cjs,ts,d.ts}'],
		ignores: ['node_modules/', 'dist/', 'build/', 'test/'],
		rules: {
			'@stylistic/js/eol-last': ['error', 'always'],
			'@stylistic/js/no-trailing-spaces': ['error'],
			'@stylistic/js/comma-dangle': ['error', 'always-multiline'],

			'eqeqeq': ['error', 'allow-null'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'indent': ['warn', 'tab'],

			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/consistent-type-imports': 'error',

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
