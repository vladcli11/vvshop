/* eslint-env node */
module.exports = {
  env: {
    node: true, // ✅ spune lui ESLint că ești într-un mediu Node.js
    es2021: true,
    commonjs: true, // ✅ permite variabile globale CommonJS precum 'module'
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "script", // ✅ folosește CommonJS (cu require/module.exports)
  },
  rules: {},
};
