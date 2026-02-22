/*
  TODO

  Note when time is past UNIX_END
  Note when drift rate is severely truncated
  ...?
*/

import React from 'react'
import * as ReactDOM from 'react-dom/client'

import { App } from './components/App.tsx'

declare global {
  interface Window {
    __TAI_ENV__: string
  }
}

if (window.__TAI_ENV__ === 'development') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

const root = ReactDOM.createRoot(document.querySelector('.index__root'))
root.render(
  <App />
)
