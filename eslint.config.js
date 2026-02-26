import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import neostandard, { plugins } from 'neostandard'

export default [
  ...neostandard({
    ts: true,
    ignores: ['dist']
  }),
  plugins.react.configs.flat.recommended,
  eslintPluginReactHooks.configs.flat.recommended
]
