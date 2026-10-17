import type { Plugin } from 'vite';
import { generateModule } from './codegen';

export interface ModalHubPluginOptions {
  /**
   * Glob(s) for normal modals (relative to project root, `!` excludes supported).
   * @default ['/src/modals/*.tsx', '/src/modals/**&#47;index.tsx']
   */
  modals?: string | string[];
  /**
   * Glob(s) for eager modals that ignore `ready`.
   * @default ['/src/modals-eager/*.tsx', '/src/modals-eager/**&#47;index.tsx']
   */
  eagerModals?: string | string[];
}

const defaults: Required<ModalHubPluginOptions> = {
  modals: ['/src/modals/*.tsx', '/src/modals/**/index.tsx'],
  eagerModals: ['/src/modals-eager/*.tsx', '/src/modals-eager/**/index.tsx'],
};

const toArr = (value: string | string[]): string[] => (Array.isArray(value) ? value : [value]);

const factory = (inOptions?: ModalHubPluginOptions): Plugin => {
  const options = {
    modals: toArr(inOptions?.modals ?? defaults.modals),
    eagerModals: toArr(inOptions?.eagerModals ?? defaults.eagerModals),
  };

  const virtualModuleId = 'virtual:react-modal-hub';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'vite-plugin-react-modal-hub',

    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },

    load(id) {
      if (id === resolvedVirtualModuleId) return generateModule(options);
    },
  };
};

export default factory;
