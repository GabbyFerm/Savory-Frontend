import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Avatar from "../common/Avatar";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserName: string;
  currentEmail: string;
  currentAvatarColor: string;
  onSave: (userName: string, email: string, avatarColor: string) => Promise<void>;
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

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUserName,
  currentEmail,
  currentAvatarColor,
  onSave,
}: EditProfileModalProps) {
  const [userName, setUserName] = useState(currentUserName);
  const [email, setEmail] = useState(currentEmail);
  const [avatarColor, setAvatarColor] = useState(currentAvatarColor);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ userName: "", email: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    setErrors({ userName: "", email: "" });
    let hasError = false;

    if (!userName || userName.length < 3) {
      setErrors((prev) => ({
        ...prev,
        userName: "Username must be at least 3 characters",
      }));
      hasError = true;
    }

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      await onSave(userName, email, avatarColor);
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setUserName(currentUserName);
      setEmail(currentEmail);
      setAvatarColor(currentAvatarColor);
      setErrors({ userName: "", email: "" });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-light rounded-lg p-8 max-w-md w-full shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-dark hover:text-primary transition disabled:opacity-50"
          >
            <X size={24} />
          </button>

          {/* Title */}
          <DialogTitle className="font-display text-3xl font-bold mb-6 text-dark">
            Edit Profile
          </DialogTitle>

          {/* Avatar Preview */}
          <div className="flex justify-center mb-6">
            <Avatar userName={userName || "User"} avatarColor={avatarColor} size="xl" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Username"
              placeholder="Your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              error={errors.userName}
              disabled={isLoading}
            />

            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={isLoading}
            />

            {/* Avatar Color Picker */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Avatar Color</label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAvatarColor(color)}
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                      avatarColor === color ? "ring-4 ring-primary ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                fullWidth
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading} fullWidth>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
