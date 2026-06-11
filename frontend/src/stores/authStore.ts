import { create } from "zustand";
import { apiClient, setAuthToken } from "../services/apiClient";

interface AuthUser {
  id: string;
  email: string;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  restoreToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  register: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/auth/register", {
        email,
        password,
      });
      const { user, token } = response.data;
      setAuthToken(token);
      set({ user, token, isLoading: false });
      localStorage.setItem("authToken", token);
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });
      const { user, token } = response.data;
      setAuthToken(token);
      set({ user, token, isLoading: false });
      localStorage.setItem("authToken", token);
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post("/auth/logout");
      setAuthToken();
      set({ user: null, token: null, isLoading: false });
      localStorage.removeItem("authToken");
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Logout failed";
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  restoreToken: (token: string) => {
    setAuthToken(token);
    set({ token });
  },
}));
