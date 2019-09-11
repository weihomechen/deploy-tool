module.exports = {
  extends: "standard",
  parser: "babel-eslint",
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 7,
    sourceType: "module",
  },
  rules: {
    "comma-dangle": ["error", "always"],
    "semi-style": ["error", "never"],
  }
}
