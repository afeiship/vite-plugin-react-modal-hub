import { deriveKey } from './keyfn';

/**
 * Build the { key: component } map from import.meta.glob results.
 * Must stay free of TS-only syntax and closure dependencies: this function is
 * injected into the generated virtual module via `toMap.toString()`, so every
 * dependency must be an explicit parameter. Bundlers rewrite free-variable
 * references (e.g. `deriveKey` -> `_chunkXxx.deriveKey`) and the renamed
 * binding would not exist in the virtual module.
 * @param files - import.meta.glob result, `{ path: module }`
 * @param root - Group root prefix, e.g. `/src/modals/`
 * @param deriveKey - Key derivation function, supplied by the generated module
 */
export function toMap(files, root, deriveKey) {
  const map = {};
  for (const path of Object.keys(files)) {
    const key = deriveKey(path, root);
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      console.warn('[vite-plugin-react-modal-hub] duplicate modal key "' + key + '" from "' + path + '", overwritten.');
    }
    const mod = files[path];
    map[key] = mod.default || mod;
  }
  return map;
}

/**
 * Assemble the full source of the `virtual:react-modal-hub` module.
 * Runtime helpers (deriveKey/toMap) are injected via `toString()` so they
 * live here as real code instead of inline string literals.
 * @param modals - Normalized glob patterns for normal modals
 * @param modalsEager - Normalized glob patterns for eager modals
 * @param modalsRoot - Common directory root of `modals`
 * @param modalsEagerRoot - Common directory root of `modalsEager`
 */
export const buildModule = (
  modals: string[],
  modalsEager: string[],
  modalsRoot: string,
  modalsEagerRoot: string,
): string => `
const deriveKey = ${deriveKey.toString()};
const toMap = ${toMap.toString()};

const modalsFiles = import.meta.glob(${JSON.stringify(modals)}, { eager: true });
const modalsEagerFiles = import.meta.glob(${JSON.stringify(modalsEager)}, { eager: true });

export const modals = toMap(modalsFiles, ${JSON.stringify(modalsRoot)}, deriveKey);
export const modalsEager = toMap(modalsEagerFiles, ${JSON.stringify(modalsEagerRoot)}, deriveKey);
export const eagerModals = modalsEager;
export default { modals, modalsEager, eagerModals };
`.trim();
