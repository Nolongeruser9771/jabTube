module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
  compilerOptions: {
    // ...rest of the template
    "types": ["node"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  include: ["src"],
  references: [{ "path": "./tsconfig.node.json" }]
}
