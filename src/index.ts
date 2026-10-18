import type { Plugin } from 'vite';
import { generateModule } from './codegen';

export interface ModalHubPluginOptions {
  /**
   * Glob(s) for normal modals (relative to project root, `!` excludes supported).
   * @default ['/src/shared/modals/*.tsx', '/src/shared/modals/**&#47;index.tsx']
   */
  modals?: string | string[];
  /**
   * Glob(s) for eager modals that ignore `ready`.
   * @default ['/src/shared/modals-eager/*.tsx', '/src/shared/modals-eager/**&#47;index.tsx']
   */
  modalsEager?: string | string[];
  /**
   * @deprecated Use `modalsEager` instead.
   */
  eagerModals?: string | string[];
}

const defaults: Required<Omit<ModalHubPluginOptions, 'eagerModals'>> = {
  modals: ['/src/shared/modals/*.tsx', '/src/shared/modals/**/index.tsx'],
  modalsEager: ['/src/shared/modals-eager/*.tsx', '/src/shared/modals-eager/**/index.tsx'],
};

const toArr = (value: string | string[]): string[] => (Array.isArray(value) ? value : [value]);

const factory = (inOptions?: ModalHubPluginOptions): Plugin => {
  const options = {
    modals: toArr(inOptions?.modals ?? defaults.modals),
    modalsEager: toArr(inOptions?.modalsEager ?? inOptions?.eagerModals ?? defaults.modalsEager),
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
