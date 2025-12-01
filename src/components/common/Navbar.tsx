import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, PlusCircle, BookOpen, LogOut, Menu, X } from "lucide-react";

interface NavbarProps {
  userName?: string;
  onLogout: () => void;
}

export default function Navbar({ userName, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 px-4 transition-colors ${
      isActive ? "text-secondary" : "text-light hover:text-secondary"
    }`;

  return (
    // relative so the mobile menu can be positioned absolutely (overlay)
    <div className="relative">
      {/* Desktop nav: align items to the bottom so icons/labels sit on the same baseline as the tagline */}
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
          <div className="ml-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-darkTeal font-bold text-sm">
              {userName.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </nav>

      {/* Mobile: hamburger visible on small screens and stays on the same header row */}
      <div className="md:hidden flex items-center">
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((s) => !s)}
          className="p-2 rounded-md text-white/90 hover:bg-white/5"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile panel: absolute overlay so it doesn't push content down */}
      {mobileOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-primary/90 rounded-md p-2 space-y-1 z-50 md:hidden">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded hover:text-secondary text-light"
            onClick={() => setMobileOpen(false)}
          >
            <Home size={18} />
            <span className="text-sm">My Dashboard</span>
          </NavLink>

          <NavLink
            to="/create-recipe"
            className="flex items-center gap-3 px-3 py-2 hover:text-secondary text-light border-t border-light"
            onClick={() => setMobileOpen(false)}
          >
            <PlusCircle size={18} />
            <span className="text-sm">Create Recipe</span>
          </NavLink>

          <NavLink
            to="/my-recipes"
            className="flex items-center gap-3 px-3 py-2 hover:text-secondary text-light border-t border-light"
            onClick={() => setMobileOpen(false)}
          >
            <BookOpen size={18} />
            <span className="text-sm">My Recipes</span>
          </NavLink>

          <button
            onClick={() => {
              onLogout();
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 hover:text-secondary text-light border-t border-light"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>

          {userName && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-darkTeal font-bold text-sm">
                  {userName.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium">{userName}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
