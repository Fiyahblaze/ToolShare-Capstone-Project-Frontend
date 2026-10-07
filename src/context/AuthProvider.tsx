import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "./authContext";
import { apiRequest } from "../services/api";
import type {
  AuthResponse,
  CurrentUserResponse,
  User,
} from "../types/user";

const TOKEN_KEY = "toolshare_token";

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function restoreSession() {
      try {
        if (!token) return;

        const data = await apiRequest<CurrentUserResponse>("/auth/me", {
          token,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setUser(data.user);
        }
      } catch {
        if (!controller.signal.aborted) {
          sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void restoreSession();

    return () => controller.abort();
  }, [token]);

  function saveSession(data: AuthResponse) {
    sessionStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function login(email: string, password: string) {
    const data = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    saveSession(data);
  }

  async function register(
    name: string,
    email: string,
    password: string
  ) {
    const data = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    saveSession(data);
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}