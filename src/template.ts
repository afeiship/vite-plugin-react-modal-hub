import { deriveKey } from './keyfn';

/**
 * Build the { key: component } map from import.meta.glob results.
 * Must stay free of TS-only syntax and closure dependencies: this function is
 * injected into the generated virtual module via `toMap.toString()`.
 * @param files - import.meta.glob result, `{ path: module }`
 * @param root - Group root prefix, e.g. `/src/modals/`
 */
export function toMap(files, root) {
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
 * @param eagerModals - Normalized glob patterns for eager modals
 * @param modalsRoot - Common directory root of `modals`
 * @param eagerModalsRoot - Common directory root of `eagerModals`
 */
export const buildModule = (
  modals: string[],
  eagerModals: string[],
  modalsRoot: string,
  eagerModalsRoot: string,
): string => `
const deriveKey = ${deriveKey.toString()};
const toMap = ${toMap.toString()};

const modalsFiles = import.meta.glob(${JSON.stringify(modals)}, { eager: true });
const eagerModalsFiles = import.meta.glob(${JSON.stringify(eagerModals)}, { eager: true });

export const modals = toMap(modalsFiles, ${JSON.stringify(modalsRoot)});
export const eagerModals = toMap(eagerModalsFiles, ${JSON.stringify(eagerModalsRoot)});
export default { modals, eagerModals };
`.trim();
