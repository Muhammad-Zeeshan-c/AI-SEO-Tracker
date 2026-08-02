import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
  (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<user | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const api = useMemo(() => {
    return axios.create({
      baseURL: backendUrl + "/api",
    });
  }, []);

  useEffect(() => {
    const interceptorId = api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }

      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptorId);
    };
  }, [api]);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await api.get("/auth/user");
        const data = response.data;

        if (isMounted && data.success) {
          setUser(data.user);
        }
      } catch (error) {
        localStorage.removeItem("token");
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [api, token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
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
