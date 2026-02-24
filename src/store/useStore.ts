import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { ReagentCategory, ReagentState } from '../data/reagents';

export interface InventoryItem {
  id: string;
  reagentId: string; // Refers to PredefinedReagent id, or custom if needed
  name: string;
  category: ReagentCategory;
  state: ReagentState;
  quantity: number;
  unit: 'g' | 'ml';
  concentration?: number; // For solutions
  location?: string; // e.g. "Шкаф 1, Полка 2"
}

export interface LabWork {
  id: string;
  title: string;
  date: string; // ISO string
  groupsCount: number;
  reagentsNeeded: { inventoryId: string; amountPerGroup: number }[];
  equipmentNeeded: { name: string; amountPerGroup: number }[];
  notes?: string;
}

interface AppState {
  inventory: InventoryItem[];
  labWorks: LabWork[];
  
  // Inventory actions
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  removeInventoryItem: (id: string) => void;
  
  // LabWork actions
  addLabWork: (work: Omit<LabWork, 'id'>) => void;
  updateLabWork: (id: string, work: Partial<LabWork>) => void;
  removeLabWork: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      inventory: [],
      labWorks: [],
      
      addInventoryItem: (item) => set((state) => ({
        inventory: [...state.inventory, { ...item, id: uuidv4() }]
      })),
      updateInventoryItem: (id, updatedItem) => set((state) => ({
        inventory: state.inventory.map(item => item.id === id ? { ...item, ...updatedItem } : item)
      })),
      removeInventoryItem: (id) => set((state) => ({
        inventory: state.inventory.filter(item => item.id !== id)
      })),
      
      addLabWork: (work) => set((state) => ({
        labWorks: [...state.labWorks, { ...work, id: uuidv4() }]
      })),
      updateLabWork: (id, updatedWork) => set((state) => ({
        labWorks: state.labWorks.map(work => work.id === id ? { ...work, ...updatedWork } : work)
      })),
      removeLabWork: (id) => set((state) => ({
        labWorks: state.labWorks.filter(work => work.id !== id)
      })),
    }),
    {
      name: 'chemlab-storage',
    }
  )
);
