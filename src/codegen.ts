import { deriveKey } from './keyfn';

/**
 * Derive the common directory root of a set of glob patterns.
 * Root = public directory prefix of each pattern (up to the first `*`),
 * intersected across patterns, always ending with `/`.
 * Negated (`!`) exclusion patterns are ignored for root derivation.
 * @param patterns - Glob patterns relative to project root, e.g. `['/src/modals/*.tsx']`
 */
export const commonRoot = (patterns: string[]): string => {
  const roots = patterns
    .filter((p) => !p.startsWith('!'))
    .map((p) => {
      const star = p.indexOf('*');
      return star === -1 ? p : p.slice(0, star);
    });
  let prefix = roots[0] || '/';
  for (const r of roots) {
    while (!r.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  const idx = prefix.lastIndexOf('/');
  return idx <= 0 ? '/' : prefix.slice(0, idx + 1);
};

export interface GenerateModuleOptions {
  /** Glob patterns for normal modals. */
  modals: string[];
  /** Glob patterns for eager modals. */
  eagerModals: string[];
}

/**
 * Generate the source of the `virtual:react-modal-hub` module.
 * @param options - Normalized (array) glob option values
 */
export const generateModule = (options: GenerateModuleOptions): string => {
  const modalsRoot = commonRoot(options.modals);
  const eagerRoot = commonRoot(options.eagerModals);

  return `
const deriveKey = ${deriveKey.toString()};

function toMap(files, root) {
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

const modalsFiles = import.meta.glob(${JSON.stringify(options.modals)}, { eager: true });
const eagerModalsFiles = import.meta.glob(${JSON.stringify(options.eagerModals)}, { eager: true });

export const modals = toMap(modalsFiles, ${JSON.stringify(modalsRoot)});
export const eagerModals = toMap(eagerModalsFiles, ${JSON.stringify(eagerRoot)});
export default { modals, eagerModals };
`.trim();
};
