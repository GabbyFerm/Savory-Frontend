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
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      const { token, user: userData } = response.data;

      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update state
      setUser(userData);

      toast.success(`Welcome back, ${userData.userName}!`);
      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterRequest) => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);
      const { token, user: newUser } = response.data;

      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));

      // Update state
      setUser(newUser);

      toast.success(`Welcome to Savory, ${newUser.userName}!`);
      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear state
    setUser(null);

    toast.success("Logged out successfully");
    navigate("/");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
