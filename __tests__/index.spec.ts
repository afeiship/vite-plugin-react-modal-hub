import { deriveKey } from '../src/keyfn';
import { commonRoot, generateModule } from '../src/codegen';

describe('deriveKey', () => {
  test('plain file: login.tsx → login', () => {
    expect(deriveKey('/src/modals/login.tsx', '/src/modals/')).toBe('login');
  });

  test('camelizes kebab: date-picker.tsx → datePicker', () => {
    expect(deriveKey('/src/modals/date-picker.tsx', '/src/modals/')).toBe('datePicker');
  });

  test('folds index: user/index.tsx → user', () => {
    expect(deriveKey('/src/modals/user/index.tsx', '/src/modals/')).toBe('user');
  });

  test('joins subdirs with dot: confirm/delete/index.tsx → confirm.delete', () => {
    expect(deriveKey('/src/modals/confirm/delete/index.tsx', '/src/modals/')).toBe('confirm.delete');
  });

  test('non-index file in subdir: user/profile.tsx → user.profile', () => {
    expect(deriveKey('/src/modals/user/profile.tsx', '/src/modals/')).toBe('user.profile');
  });

  test('empty after fold falls back to index: index.tsx → index', () => {
    expect(deriveKey('/src/modals/index.tsx', '/src/modals/')).toBe('index');
  });
});

describe('commonRoot', () => {
  test('single pattern keeps dir prefix up to first *', () => {
    expect(commonRoot(['/src/modals/*.tsx'])).toBe('/src/modals/');
  });

  test('multiple patterns with same prefix share the prefix', () => {
    expect(commonRoot(['/src/modals/*.tsx', '/src/modals/**/index.tsx'])).toBe('/src/modals/');
  });

  test('multiple patterns cut back to common directory', () => {
    expect(commonRoot(['/src/a/*.tsx', '/src/b/*.tsx'])).toBe('/src/');
  });

  test('no common prefix falls back to /', () => {
    expect(commonRoot(['/a/*.tsx', '/b/*.tsx'])).toBe('/');
  });

  test('excludes ! patterns from root derivation', () => {
    expect(commonRoot(['/src/modals/*.tsx', '!/src/modals/secret/**'])).toBe('/src/modals/');
  });
});

describe('generateModule', () => {
  const options = {
    modals: ['/src/modals/*.tsx', '/src/modals/**/index.tsx'],
    eagerModals: ['/src/modals-eager/*.tsx', '/src/modals-eager/**/index.tsx'],
  };

  test('emits import.meta.glob for both groups with derived roots and default export', () => {
    const code = generateModule(options);
    expect(code).toContain('import.meta.glob(["/src/modals/*.tsx","/src/modals/**/index.tsx"], { eager: true })');
    expect(code).toContain('import.meta.glob(["/src/modals-eager/*.tsx","/src/modals-eager/**/index.tsx"], { eager: true })');
    expect(code).toContain('export const modals = toMap(modalsFiles, "/src/modals/")');
    expect(code).toContain('export const eagerModals = toMap(eagerModalsFiles, "/src/modals-eager/")');
    expect(code).toContain('export default { modals, eagerModals };');
  });

  test('emits toMap with injected deriveKey, default fallback and duplicate warn', () => {
    const code = generateModule(options);
    expect(code).toContain('function toMap(files, root)');
    expect(code).toContain('const deriveKey = ');
    expect(code).toContain('duplicate modal key');
    expect(code).toContain('console.warn');
    expect(code).toContain('mod.default || mod');
    expect(code).toContain('Object.prototype.hasOwnProperty.call(map, key)');
  });
});
