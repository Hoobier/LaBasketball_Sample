"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialAuth(): { token: string | null; user: User | null } {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  if (token && storedUser) {
    return { token, user: JSON.parse(storedUser) };
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<{ token: string | null; user: User | null }>(() => getInitialAuth());

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setAuthState({ token: newToken, user: newUser });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({ token: null, user: null });
  }, []);

  return (
    <AuthContext.Provider value={{ user: authState.user, token: authState.token, isLoading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
