module.exports = {
	root: true,
  ignorePatterns: [".eslintrc.cjs"],
	env: {
		'browser': true,
		'es6': true,
		'node': true
	},
	extends: [
		'airbnb-base',
		'prettier',
		'plugin:@typescript-eslint/recommended',
		"plugin:prettier/recommended"
	],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	plugins: [
		'@typescript-eslint'
	],
	rules: {
		'no-shadow': 'off'
	}
};
