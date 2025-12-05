import { Clock, ChefHat, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../../types";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate();

  const imageUrl = recipe.imagePath
    ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${recipe.imagePath}`
    : null;

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat size={64} className="text-primary/40" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-xs font-semibold text-darkTeal">{recipe.categoryName}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-display text-xl font-bold text-dark mb-2 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="text-sm text-dark/60 mb-3 line-clamp-2">{recipe.description}</p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-dark/60">
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-primary" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat size={16} className="text-primary" />
            <span>{recipe.cookTime} min cook</span>
          </div>
          <div className="flex items-center gap-1">
            <Utensils size={16} className="text-primary" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
