import fsPromises from 'node:fs/promises'

export const config = {
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  format: 'esm',
  outfile: './dist/main.js',
  metafile: true,
  external: ['react', 'react-dom/client', 'react-router', 't-a-i'],
  plugins: [{
    name: 'copyFiles',
    setup (build) {
      build.onStart(async () => {
        await fsPromises.rm('./dist', { recursive: true, force: true })
        await fsPromises.cp('./src/index.html', './dist/index.html')
        await fsPromises.cp('./src/favicon.png', './dist/favicon.png')
      })
    }
  }]
}
