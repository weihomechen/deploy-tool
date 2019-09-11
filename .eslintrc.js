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
    "comma-dangle": [
      "error",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "ignore"
      }
    ],
    "semi": [
      "error",
      "never"
    ],
    "space-before-function-paren": 0
  }
}
