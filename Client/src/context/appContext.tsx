import { createContext, useContext, useEffect, useState } from "react";
import type { AxiosInstance } from "axios";
import type { ReactNode } from "react";
import axios from "axios";

interface user {
  id: string;
  name: string;
  email: string;
  plan: string;
  analysisCount?: number;
}

interface AppContextType {
  user: user | null;
  token: string | null;
  loading: boolean;
  api: AxiosInstance;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<user | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: backendUrl + "/api",
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  const loadUser = async () => {
    if (!token) {
      setLoading(false);

      try {
        const response = await api.get("/auth/user");
        const data = response.data;

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }

      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        console.log(response.data)
        setToken(response.data.jwtToken ?? response.data.token);
        setUser(response.data.user);
        localStorage.setItem("token", response.data.jwtToken ?? response.data.token);

        return { success: true };
        
      }

      return { success: false };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Login failed",
      };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        name,
      });

      if (response.data.success) {
        setToken(response.data.jwtToken ?? response.data.token);
        setUser(response.data.user);
        localStorage.setItem("token", response.data.jwtToken ?? response.data.token);
        console.log("Registration successful:", response.data);
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Registration failed",
      };
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value: AppContextType = {
    user,
    token,
    loading,
    api,
    login,
    register,
    logout,
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}
