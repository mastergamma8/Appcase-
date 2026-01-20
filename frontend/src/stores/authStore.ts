import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface User {
  id: number;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  balance: number;
  casesOpened: number;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (initData: string) => Promise<void>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,

  login: async (initData: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/telegram`, {
        initData,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login failed:', error);
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  updateBalance: (newBalance: number) => {
    set((state) => ({
      user: state.user ? { ...state.user, balance: newBalance } : null,
    }));
  },
}));

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
