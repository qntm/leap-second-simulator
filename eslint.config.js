import neostandard, { plugins } from 'neostandard'

export default [
  ...neostandard({
    ts: true,
    ignores: ['dist']
  }),
  plugins.react.configs.flat.recommended
]
