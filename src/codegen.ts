import { buildModule } from './template';

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
  modalsEager?: string[];
}

/**
 * Generate the source of the `virtual:react-modal-hub` module.
 * @param options - Normalized (array) glob option values
 */
export const generateModule = (options: GenerateModuleOptions): string => {
  const modalsEager = options.modalsEager ?? [];
  return buildModule(
    options.modals,
    modalsEager,
    commonRoot(options.modals),
    commonRoot(modalsEager),
  );
};
