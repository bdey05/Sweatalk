import { create } from "zustand";


type customError = string | null 

type AuthState = {
    user: { 
        id: number
        username: string
        email: string
    } | null
    token: string | null
    loginError: customError
    registerError: customError
    handleLogin: (email: string, password: string) => Promise<boolean>
    handleRegister: (username: string, email: string, password: string, age: number, weight: number, height: number) => Promise<boolean>
    handleLogout: () => void
};


export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem("token"),
    loginError: null,
    registerError: null,
    handleLogin: async (email, password) => {
        try {
          const res = await fetch("http://localhost:5000/login", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
          });
          if (!res.ok) {
            throw new Error(`Response status: ${res.status}`);
          }
          const data = await res.json();
          localStorage.setItem("token", data["token"]);
          //ToDo: Modify Flask API to return User on login along with token
          //set({user: data["user"], token: data["token"]});
          set({token: data["token"]});
          return true;
        } catch (error) {
            set({loginError: error as customError});
            return false;
        }
    },
    handleRegister: async (username, email, password, age, weight, height) => {
        try {
          const res = await fetch("http://localhost:5000/register", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, email, password})
          });
          if (!res.ok) {
            throw new Error(`Response status: ${res.status}`);
          }
          const data = await res.json();
          return true;
        } catch (error) {
            set({registerError: error as customError});
            return false;
        }
    },
    handleLogout: () => {
        localStorage.clear();
        set({user: null, token: null}); 
    }
}))