import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-darkTeal text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © <span className="font-display italic">Savory</span> - Your personal
          Recipe Manager
        </p>
        <p className="text-xs opacity-75 mt-1">
          Built with 💚 by Gabriella Frank Ferm
        </p>
        <Heart size={20} />
        <span className="text-xs font-medium">Create Recipe</span>
      </div>
    </footer>
  );
}
