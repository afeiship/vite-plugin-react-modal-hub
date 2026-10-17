/**
 * Derive the registration key for a modal file path.
 * Must stay free of TS-only syntax and closure dependencies: this function is
 * injected into the generated virtual module via `deriveKey.toString()`.
 * @param path - Glob-matched path, e.g. `/src/modals/date-picker.tsx`
 * @param root - Group root prefix, e.g. `/src/modals/`
 */
export const deriveKey = (path, root) => {
  const rel = path.startsWith(root) ? path.slice(root.length) : path;
  const noExt = rel.replace(/\.[^/.]+$/, '');
  const segments = noExt.split('/').filter(Boolean);
  if (segments[segments.length - 1] === 'index') segments.pop();
  if (segments.length === 0) segments.push('index');
  return segments
    .map((seg) => seg.replace(/[._-]/g, '_').replace(/_(\w)/g, (_, c) => c.toUpperCase()))
    .join('.');
};
