import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
}

export default function ChangePasswordModal({ isOpen, onClose, onSave }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    let hasError = false;

    if (!currentPassword) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: "Current password is required",
      }));
      hasError = true;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "New password must be at least 6 characters",
      }));
      hasError = true;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      await onSave(currentPassword, newPassword);
      handleClose();
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
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
            Change Password
          </DialogTitle>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              error={errors.currentPassword}
              disabled={isLoading}
            />

            <Input
              type="password"
              label="New Password"
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

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
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
