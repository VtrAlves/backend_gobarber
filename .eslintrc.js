module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ['prettier', 'standard'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    //'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    //camelcase: 'off'
    //"no-used-vars": ["error", {"argsIgnorePattern": "next"}],
    'space-before-function-paren': ['error', 'always']
  }
}
