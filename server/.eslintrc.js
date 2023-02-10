module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier/prettier',
        'prettier',
        'plugin:@typescript-eslint/eslint-recommended',

        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    root: true,
    env: {
        es2022: true,
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        complexity: ['error', 3],
        tabWith: 4,
        '@typescript-eslint/space-before-function-paren': 'off',
        '@typescript-eslint/space-before-blocks': 'error',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
}
