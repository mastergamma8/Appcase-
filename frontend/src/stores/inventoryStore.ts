import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface InventoryItem {
  id: number;
  name: string;
  image: string;
  rarity: string;
  price: number;
  createdAt: string;
}

interface InventoryState {
  items: InventoryItem[];
  isLoading: boolean;
  fetchInventory: () => Promise<void>;
  exchangeItem: (itemId: number) => Promise<any>;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  isLoading: false,

  fetchInventory: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/api/inventory`);
      set({ items: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      set({ isLoading: false });
    }
  },

  exchangeItem: async (itemId: number) => {
    try {
      const response = await axios.post(`${API_URL}/api/inventory/exchange`, {
        itemId,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to exchange item:', error);
      throw error;
    }
  },
}));
