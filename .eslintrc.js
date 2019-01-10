module.exports = {
  parser: "babel-eslint",
  plugins: [
    "node"
  ],
  parserOptions: {
    ecmaVersion: 2017
  },
  env: {
    jest: true,
    es6: true,
    node: true,
  },
  rules: {
    indent: ["error", 2, {
      "MemberExpression": "off"
    }],
    'no-unused-vars': ["error"],
  }
}
