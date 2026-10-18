declare module 'virtual:react-modal-hub' {
  type ModalMap = Record<string, any>;

  export const modals: ModalMap;
  export const modalsEager: ModalMap;
  const hub: { modals: ModalMap; modalsEager: ModalMap };
  export default hub;
}
