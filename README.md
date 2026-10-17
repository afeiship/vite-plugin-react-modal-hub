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
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import modalHub from '@jswork/vite-plugin-react-modal-hub';

export default defineConfig({
  plugins: [react(), modalHub()],
});
```

```tsx
// provider.tsx
import modals from 'virtual:react-modal-hub';
import { ModalHub } from '@jswork/react-modal-hub';

export default function Provider({ children, ready }) {
  return <ModalHub {...modals} ready={ready}>{children}</ModalHub>;
}
```

## options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `modals` | `string \| string[]` | `['/src/modals/*.tsx', '/src/modals/**/index.tsx']` | Globs for normal modals |
| `eagerModals` | `string \| string[]` | `['/src/modals-eager/*.tsx', '/src/modals-eager/**/index.tsx']` | Globs for eager modals (ignore `ready`) |

Globs are relative to the project root; `!` excludes are supported. Registration keys derive from each path relative to the group's common root: `user/index.tsx` → `user`, `date-picker.tsx` → `datePicker`, `confirm/delete/index.tsx` → `confirm.delete`.

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
