import { create } from 'zustand';

type SidebarStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

// This creates a simple store to manage the mobile sidebar's state
export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
