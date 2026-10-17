# vite-plugin-react-modal-hub
> Zero-config modal discovery and registration for @jswork/react-modal-hub.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install @jswork/vite-plugin-react-modal-hub
```

## usage
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePlugin from '@jswork/vite-plugin-react-modal-hub';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePlugin()],
  server: {
    host: '0.0.0.0'
  }
});
```

## license
Code released under [the MIT license](https://github.com/afeiship/vite-plugin-react-modal-hub/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/vite-plugin-react-modal-hub
[version-url]: https://npmjs.org/package/@jswork/vite-plugin-react-modal-hub

[license-image]: https://img.shields.io/npm/l/@jswork/vite-plugin-react-modal-hub
[license-url]: https://github.com/afeiship/vite-plugin-react-modal-hub/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/vite-plugin-react-modal-hub
[size-url]: https://github.com/afeiship/vite-plugin-react-modal-hub/blob/master/dist/index.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/vite-plugin-react-modal-hub
[download-url]: https://www.npmjs.com/package/@jswork/vite-plugin-react-modal-hub
