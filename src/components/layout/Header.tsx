import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";

interface HeaderProps {
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
}

export default function Header({
  isAuthenticated,
  userName,
  onLogout,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
            className="cursor-pointer"
          >
            <h1 className="font-display text-3xl font-black">Savory</h1>
            <p className="text-xs opacity-90">Your personal Recipe Manager</p>
          </div>

          {/* Navigation - only show when authenticated */}
          {isAuthenticated && (
            <Navbar userName={userName} onLogout={onLogout} />
          )}
        </div>
      </div>
    </header>
  );
}
