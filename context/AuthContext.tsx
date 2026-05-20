"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { signin, signup, logout, auth } from "@/services/authService";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name?: string | null;
}

interface Organization {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    organizationName: string;
    name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    auth()
      .then((data) => {
        if (data.success) {
          setUser(data.result.user);
          setOrganization(data.result.organization);
        } else {
          toast.error("Authentication failed, Please Login");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await signin({ email, password });
    if (!res.success) throw new Error(res.message);
    setUser(res.result.user);
    setOrganization(res.result.organization);

    router.push("/");
  }

  async function register(formData: {
    email: string;
    password: string;
    organizationName: string;
    name?: string;
  }) {
    const res = await signup(formData);
    if (!res.success) throw new Error(res.message);

    router.push("/sign-in");
  }

  async function logoutUser() {
    await logout();
    setUser(null);
    setOrganization(null);

    router.push("/sign-in");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        loading,
        login,
        register,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
