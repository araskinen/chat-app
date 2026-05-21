import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, LoginPayload, RegisterPayload } from "@/types";
import { authApi } from "@/services/api";
import { connectSocket, disconnectSocket } from "@/services/socket";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authApi.login(payload);
          localStorage.setItem("token", token);
          connectSocket(token);
          set({ user, token, isLoading: false });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Login failed";
          set({ error: msg, isLoading: false });
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authApi.register(payload);
          localStorage.setItem("token", token);
          connectSocket(token);
          set({ user, token, isLoading: false });
        } catch (err: unknown) {
          const msg =
            err instanceof Error ? err.message : "Registration failed";
          set({ error: msg, isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        disconnectSocket();
        set({ user: null, token: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth",
      partialize: (s) => ({ user: s.user, token: s.token }),

      // Handle browser refresh - if we have a token, reconnect the socket
      onRehydrateStorage: () => (state) => {
        if (state?.token) connectSocket(state.token);
      },
    },
  ),
);
