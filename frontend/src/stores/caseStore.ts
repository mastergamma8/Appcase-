import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ItemTemplate {
  id: number;
  name: string;
  image: string;
  rarity: string;
  price: number;
  dropChance?: number;
}

export interface Case {
  id: number;
  key: string;
  name: string;
  price: number;
  image: string;
  tier: number;
  items: ItemTemplate[];
}

interface CaseState {
  cases: Case[];
  isLoading: boolean;
  fetchCases: () => Promise<void>;
  openCase: (caseId: number) => Promise<any>;
}

export const useCaseStore = create<CaseState>((set) => ({
  cases: [],
  isLoading: false,

  fetchCases: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/api/cases`);
      set({ cases: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      set({ isLoading: false });
    }
  },

  openCase: async (caseId: number) => {
    try {
      const response = await axios.post(`${API_URL}/api/cases/open`, {
        caseId,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to open case:', error);
      throw error;
    }
  },
}));
