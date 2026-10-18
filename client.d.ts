declare module 'virtual:react-modal-hub' {
  type ModalMap = Record<string, any>;

  export const modals: ModalMap;
  export const modalsEager: ModalMap;
  /** @deprecated Use `modalsEager` instead. */
  export const eagerModals: ModalMap;
  const hub: { modals: ModalMap; modalsEager: ModalMap; eagerModals: ModalMap };
  export default hub;
}
