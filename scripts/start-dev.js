import * as esbuild from 'esbuild'

import { config } from './esbuild.config.js'

const context = await esbuild.context({
  ...config,
  define: {
    'window.__TAI_ENV__': JSON.stringify('development')
  }
})

await context.watch()

await context.serve({
  servedir: 'dist',
  port: 3000
})

console.log('listening')
console.log('http://localhost:3000/index.html')
