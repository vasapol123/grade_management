module.exports = {
	root: true,
  ignorePatterns: ['.eslintrc.cjs'],
	extends: [
		'airbnb-base',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:prettier/recommended'
	],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	rules: {
		'no-shadow': 'off',
		'import/no-unresolved': [
      2, 
      { 'caseSensitive': false }
   	],
		'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never'
      }
   ],
	 '@typescript-eslint/no-non-null-assertion': 'off',
	 'camelcase': 'off',
	},
	settings: {
    'import/resolver': {
			typescript: {
				project: 'tsconfig.json',
			},
      node: {
				project: 'tsconfig.json',
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};
