import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import neostandard, { plugins } from 'neostandard'

const eslintPluginReact = plugins.react

export default [
  ...neostandard({
    ts: true,
    ignores: ['dist']
  }),
  {
    ...eslintPluginReact.configs.flat['jsx-runtime'],
    settings: {
      ...eslintPluginReact.configs.flat['jsx-runtime'].settings,
      react: {
        version: 'detect'
      }
    }
  },
  eslintPluginReactHooks.configs.flat.recommended
]
