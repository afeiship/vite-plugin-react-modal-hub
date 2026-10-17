declare module 'virtual:react-modal-hub' {
  type ModalMap = Record<string, any>;

  export const modals: ModalMap;
  export const eagerModals: ModalMap;
  const hub: { modals: ModalMap; eagerModals: ModalMap };
  export default hub;
}
