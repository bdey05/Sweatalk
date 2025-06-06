import { create } from "zustand";

const apiUrl = import.meta.env.VITE_APP_API_URL;


type AuthState = {
  user: {
    id: number;
    username: string;
    email: string;
    age: number;
    weight: number;
    height: number;
  } | null;
  token: string | null;
  loginError: Error | null;
  registerError: Error | null;
  handleLogin: (email: string, password: string) => Promise<boolean>;
  handleRegister: (
    username: string,
    email: string,
    password: string,
    age: number,
    weight: number,
    height: number
  ) => Promise<boolean>;
  handleLogout: () => Promise<boolean>;
  resetErrors: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loginError: null,
  registerError: null,
  handleLogin: async (email, password) => {
    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Invalid credentials, please try again.");
      }
      const data = await res.json();
      localStorage.setItem("token", data["token"]);
      localStorage.setItem("user", JSON.stringify(data["userObj"]));
      set({ user: data["userObj"], token: data["token"] });
      return true;
    } catch (error) {
      set({ loginError: error as Error});
      return false;
    }
  },
  handleRegister: async (username, email, password, age, weight, height) => {
    try {
      const res = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          age,
          weight,
          height,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data["error"] || `Response status: ${res.status}`);
      }
      localStorage.setItem("token", data["token"]);
      localStorage.setItem("user", JSON.stringify(data["userObj"]));
      set({ user: data["userObj"], token: data["token"] });
      return true;
    } catch (error) {
      set({ registerError: error as Error });
      return false;
    }
  },
  handleLogout: async () => {
    const JWT = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-tokens": JWT || "",
        },
      });
      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }
      localStorage.clear();
      set({ user: null, token: null });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  resetErrors: () => {
    set({ loginError: null, registerError: null });
  },
}));
