import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, PlusCircle, BookOpen, LogOut, Menu, X } from "lucide-react";
import Avatar from "./Avatar";

interface NavbarProps {
  userName?: string;
  avatarColor?: string;
  onLogout: () => void;
}

export default function Navbar({ userName, avatarColor = "#FBD180", onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 px-4 transition-colors ${
      isActive ? "text-secondary" : "text-light hover:text-secondary"
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive ? "bg-light/10 text-secondary font-semibold" : "text-light hover:bg-light/10"
    }`;

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-end gap-2">
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

        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-1 px-4 text-light hover:text-secondary transition-colors"
        >
          <LogOut size={20} />
          <span className="text-xs font-medium">Logout</span>
        </button>

        {userName && (
          <div className="ml-4">
            <Avatar userName={userName} avatarColor={avatarColor} size="md" />
          </div>
        )}
      </nav>

      {/* Mobile: Hamburger Button */}
      <div className="md:hidden flex items-center gap-3">
        {/* User Avatar on Mobile */}
        {userName && <Avatar userName={userName} avatarColor={avatarColor} size="sm" />}

        {/* Hamburger Menu Button */}
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-light hover:bg-light/10 transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`
          fixed right-5 top-16 w-72 bg-primary shadow-2xl rounded-lg 
          transform transition-all duration-300 ease-in-out z-50 md:hidden
          ${
            mobileOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 pointer-events-none"
          }
        `}
      >
        <div className="p-4 space-y-2">
          {/* Close Button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-light hover:bg-light/10 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info Section */}
          {userName && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg">
              <Avatar userName={userName} avatarColor={avatarColor} size="lg" />
              <div>
                <div className="text-light font-semibold">{userName}</div>
                <div className="text-light text-xs">View Profile</div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <NavLink
            to="/dashboard"
            className={mobileNavLinkClass}
            onClick={() => setMobileOpen(false)}
          >
            <Home size={20} />
            <span>My Dashboard</span>
          </NavLink>

          <NavLink
            to="/create-recipe"
            className={mobileNavLinkClass}
            onClick={() => setMobileOpen(false)}
          >
            <PlusCircle size={20} />
            <span>Create Recipe</span>
          </NavLink>

          <NavLink
            to="/my-recipes"
            className={mobileNavLinkClass}
            onClick={() => setMobileOpen(false)}
          >
            <BookOpen size={20} />
            <span>My Recipes</span>
          </NavLink>

          {/* Divider */}
          <div className="border-t border-light/20 my-2"></div>

          {/* Logout Button */}
          <button
            onClick={() => {
              onLogout();
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-light hover:bg-light/20 hover:text-red-500 transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
