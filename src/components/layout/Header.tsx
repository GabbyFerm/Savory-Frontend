import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";

interface HeaderProps {
  isAuthenticated: boolean;
  userName?: string;
  avatarColor?: string;
  onLogout: () => void;
}

export default function Header({ isAuthenticated, userName, avatarColor, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-primary text-light w-full">
      <div className="container mx-auto px-4 py-8 md:pt-8 md:pb-10">
        {/* Stack on mobile, row on md+. md:items-end will align the Navbar to the bottom of the logo block */}
        <div className="flex items-center md:items-end justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
            className="cursor-pointer max-w-full"
          >
            <h1 className="font-display text-6xl font-black italic">Savory</h1>
            <p className="text-xs pt-1">Your personal Recipe Manager</p>
          </div>

          {/* Navigation - only show when authenticated */}
          {isAuthenticated && (
            <Navbar userName={userName} avatarColor={avatarColor} onLogout={onLogout} />
          )}
        </div>
      </div>
    </header>
  );
}
