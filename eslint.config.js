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
			'import': importPlugin
		},
		files: ['**/*.{js,mjs,cjs,ts}'],
		ignores: ['node_modules/*'],
		rules: {
			'@stylistic/js/eol-last': ['error', 'always'],
			'@stylistic/js/no-trailing-spaces': ['error'],
			'@stylistic/js/comma-dangle': ['error'],

			'eqeqeq': ['error', 'allow-null'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'indent': ['warn', 'tab'],

			'import/order': [
				'error',
				{
					groups: [
						['builtin', 'external']
					],
					'newlines-between': 'always'
				}
			]
		}
	}
];
