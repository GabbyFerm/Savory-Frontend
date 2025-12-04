import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-darkTeal text-light py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © <span className="font-display text-lg italic">Savory</span> - Your personal Recipe
          Manager
        </p>
        <p className="text-xs mt-1 flex items-center justify-center gap-1">
          Built with
          <Heart size={16} className="text-pink-400" fill="currentColor" />
          by Gabriella Frank Ferm
        </p>
      </div>
    </footer>
  );
}
