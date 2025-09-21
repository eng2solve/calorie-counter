import {create} from "zustand";

type User = { first_name?: string; last_name?: string; email?: string } | null;

type AuthState = {
  token: string | null;
  user: User;
  setToken: (token: string | null) => void;
  setUser: (u: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },
  setUser: (u) => set({ user: u }),
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },
}));
