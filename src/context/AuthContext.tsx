import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types";
import { extractErrorMessage } from "../utils/errorHandler";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Auto-login on app load (if token exists)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Listen for storage changes AND periodic token check
  useEffect(() => {
    // Check if token is still valid periodically
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        // Token removed - logout
        if (user) {
          setUser(null);
          toast.success("You have been logged out");
          navigate("/");
        }
      }
    };

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        // Token was removed in another tab
        setUser(null);
        toast.success("You have been logged out in another tab");
        navigate("/");
      }
    };

    // Check auth every 5 seconds
    const interval = setInterval(checkAuth, 5000);

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user, navigate]);

  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      const { accessToken, refreshToken, user: userData } = response.data;

      // Store tokens and user
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      toast.success(`Welcome back, ${userData.userName}!`);
      navigate("/dashboard");
    } catch (error: any) {
      const message = extractErrorMessage(
        error,
        "Login failed. Please try again."
      );
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterRequest) => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);
      const { accessToken, refreshToken, user: newUser } = response.data;

      // Store tokens and user
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);

      toast.success(`Welcome to Savory, ${newUser.userName}!`);
      navigate("/dashboard");
    } catch (error: any) {
      const message = extractErrorMessage(
        error,
        "Registration failed. Please try again."
      );
      toast.error(message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Clear state
    setUser(null);

    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
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
