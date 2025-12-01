import { NavLink } from "react-router-dom";
import { Home, PlusCircle, BookOpen, LogOut } from "lucide-react";

interface NavbarProps {
  userName?: string;
  onLogout: () => void;
}

export default function Navbar({ userName, onLogout }: NavbarProps) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
      isActive ? "text-secondary" : "text-white hover:text-secondary"
    }`;

  return (
    <nav className="flex items-center gap-2">
      {/* Navigation Links */}
      <NavLink to="/dashboard" className={navLinkClass}>
        <Home size={20} />
        <span className="text-xs font-medium">My Dashboard</span>
      </NavLink>

      <NavLink to="/create-recipe" className={navLinkClass}>
        <PlusCircle size={20} />
        <span className="text-xs font-medium">Create Recipe</span>
      </NavLink>

      <NavLink to="/my-recipes" className={navLinkClass}>
        <BookOpen size={20} />
        <span className="text-xs font-medium">My Recipes</span>
      </NavLink>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="flex flex-col items-center gap-1 px-4 py-2 text-white hover:text-secondary transition-colors"
      >
        <LogOut size={20} />
        <span className="text-xs font-medium">Logout</span>
      </button>

      {/* User Avatar (optional) */}
      {userName && (
        <div className="ml-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-dark font-bold text-sm">
            {userName.substring(0, 2).toUpperCase()}
          </span>
        </div>
      )}
    </nav>
  );
}
