import requireExtensionsPlugin from "eslint-plugin-require-extensions";
export default
  {
    plugins: {
      requireextensions: requireExtensionsPlugin
    },
    rules: {
      'requireextensions/require-extensions': 'error'
  },
  }
