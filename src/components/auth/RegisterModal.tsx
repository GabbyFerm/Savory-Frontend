import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Input from "../common/Input";
import Button from "../common/Button";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

// Avatar color options
const AVATAR_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
  "#F8B500",
  "#6C5CE7",
  "#00B894",
  "#FD79A8",
];

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatarColor:
      AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Validation
    let hasError = false;

    if (!formData.userName || formData.userName.length < 3) {
      setErrors((prev) => ({
        ...prev,
        userName: "Username must be at least 3 characters",
      }));
      hasError = true;
    }

    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      hasError = true;
    }

    if (!formData.password || formData.password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      hasError = true;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      await register({
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        avatarColor: formData.avatarColor,
      });
      // On success, AuthContext will navigate to dashboard and show toast
      onClose();
      // Reset form
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatarColor:
          AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      });
    } catch (error) {
      // Error toast is shown in AuthContext
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatarColor:
          AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      });
      setErrors({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-[#F5F5F5] rounded-lg p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
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
            Join Savory
          </DialogTitle>
          <p className="text-dark/70 mb-6 text-sm">
            Create your account and start cooking
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Username"
              placeholder="Choose a username"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              error={errors.userName}
              disabled={isLoading}
            />

            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            {/* Avatar Color Picker */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Choose Your Avatar Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, avatarColor: color })
                    }
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                      formData.avatarColor === color
                        ? "ring-4 ring-primary ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-dark/70">
              Already have an account?{" "}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                disabled={isLoading}
                className="text-primary hover:text-primary/80 font-bold transition disabled:opacity-50"
              >
                Login
              </button>
            </p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
