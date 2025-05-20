import { atom } from 'recoil';

interface IModalState {
  isOpen: boolean;
  type?: string | null;
  payload?: unknown;
}

export const modalState = atom<IModalState>({
  key: 'modalState',
  default: {
    isOpen: false,
    type: null,
    payload: undefined,
  },
});
