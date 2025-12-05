import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Input from "../common/Input";
import Button from "../common/Button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({ email: "", password: "" });

    // Simple validation
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, password });
      // On success, AuthContext will navigate to dashboard and show toast
      onClose();
      // Reset form
      setEmail("");
      setPassword("");
    } catch (error) {
      // Error toast is shown in AuthContext
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail("");
      setPassword("");
      setErrors({ email: "", password: "" });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-[#F5F5F5] rounded-lg p-8 max-w-md w-full shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-dark hover:text-primary transition disabled:opacity-50"
          >
            <X size={24} />
          </button>

          {/* Title */}
          <DialogTitle className="font-display text-3xl font-bold mb-2 text-dark">
            Welcome Back
          </DialogTitle>
          <p className="text-dark/70 mb-6 text-sm">Login to access your recipes</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              disabled={isLoading}
            />

            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-dark/70">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToRegister();
                }}
                disabled={isLoading}
                className="text-primary hover:text-primary/80 font-bold transition disabled:opacity-50"
              >
                Sign up
              </button>
            </p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
