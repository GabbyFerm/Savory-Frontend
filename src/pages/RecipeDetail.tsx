import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  ChefHat,
  Utensils,
  Users,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import Button from "../components/common/Button";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { Recipe } from "../types";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to format ingredient quantity/unit
  const formatQuantity = (ingredient: any) => {
    // defensive fallbacks
    const rawUnit = (ingredient.unit ?? "").toString().trim();
    const rawQty = ingredient.quantity;
    const unit = rawUnit.toLowerCase();

    // "to taste" priority
    if (unit.includes("to taste")) {
      return "To taste";
    }

    // "pinch" -> "A pinch" or "N pinches"
    if (unit.includes("pinch")) {
      const qtyNum = Number(rawQty);
      if (!Number.isNaN(qtyNum) && qtyNum > 1) {
        return `${qtyNum} pinches`;
      }
      // either 0, missing or 1 -> use "A pinch"
      return "A pinch";
    }

    // If no meaningful quantity (0 / null / undefined / empty string), show just the unit if present
    if (
      rawQty === null ||
      rawQty === undefined ||
      rawQty === "" ||
      rawQty === 0 ||
      rawQty === "0"
    ) {
      return rawUnit ? capitalizeUnit(rawUnit) : "";
    }

    // Default numeric + unit rendering (preserve provided unit)
    return `${rawQty}${rawUnit ? " " + rawUnit : ""}`;
  };

  const capitalizeUnit = (s: string) =>
    s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);

  // Fetch recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/recipe/${id}`);
        const recipeData = response.data;

        console.log("✅ Recipe fetched:", recipeData);

        if (!recipeData || !recipeData.id) {
          throw new Error("Invalid recipe data received");
        }

        setRecipe(recipeData);
      } catch (error: any) {
        console.error("❌ Failed to fetch recipe:", error);
        const message =
          error.response?.data?.message || "Failed to load recipe";
        toast.error(message);
        navigate("/my-recipes");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, navigate]);

  // Delete recipe
  const handleDelete = async () => {
    if (!recipe) return;

    setIsDeleting(true);
    try {
      await api.delete(`/recipe/${recipe.id}`);
      toast.success("Recipe deleted successfully!");
      navigate("/my-recipes");
    } catch (error: any) {
      console.error("Failed to delete recipe:", error);
      const message =
        error.response?.data?.message || "Failed to delete recipe";
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <Layout
        isAuthenticated={true}
        userName={user.userName}
        avatarColor={user.avatarColor}
        onLogout={logout}
      >
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-darkTeal">Loading recipe...</p>
        </div>
      </Layout>
    );
  }

  if (!recipe) {
    return (
      <Layout
        isAuthenticated={true}
        userName={user.userName}
        avatarColor={user.avatarColor}
        onLogout={logout}
      >
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-darkTeal mb-4">Recipe not found</p>
          <Button onClick={() => navigate("/my-recipes")}>
            Back to My Recipes
          </Button>
        </div>
      </Layout>
    );
  }

  const imageUrl = recipe.imagePath
    ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${recipe.imagePath}`
    : null;

  return (
    <Layout
      isAuthenticated={true}
      userName={user.userName}
      avatarColor={user.avatarColor}
      onLogout={logout}
    >
      <div className="min-h-screen bg-light">
        {/* Hero Image Section */}
        <div className="relative h-96 bg-gradient-to-br from-primary/30 to-secondary/30">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat size={120} className="text-primary/40" />
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-secondary px-3 py-1 rounded-full text-sm font-bold text-darkTeal">
                  {recipe.categoryName}
                </span>
              </div>
              <h1 className="font-display text-5xl font-black text-light mb-2 italic">
                {recipe.title}
              </h1>
              <p className="text-light/90 text-lg">
                {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/my-recipes")}
            className="absolute top-4 left-4 bg-light/50 hover:bg-light/70 text-darkTeal px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Recipes</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Quick Stats Bar - Compact, Centered */}
          <div className="flex flex-wrap justify-left gap-4 mb-8">
            <div className="bg-secondary rounded-full px-4 py-3 flex items-center justify-center gap-3">
              <Clock className="text-darkTeal" size={20} />
              <div className="text-center">
                <p className="text-sm text-darkTeal/70">
                  Prep Time:{" "}
                  <span className="font-bold text-darkTeal">
                    {recipe.prepTime} min
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-secondary rounded-full px-4 py-3 flex items-center justify-center gap-3">
              <ChefHat className="text-darkTeal" size={20} />
              <div className="text-center">
                <p className="text-sm text-darkTeal/70">
                  Cook Time:{" "}
                  <span className="font-bold text-darkTeal">
                    {recipe.cookTime} min
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-secondary rounded-full px-4 py-3 flex items-center justify-center gap-3">
              <Users className="text-darkTeal" size={20} />
              <div className="text-center">
                <p className="text-sm text-darkTeal/70">
                  Servings:{" "}
                  <span className="font-bold text-darkTeal">
                    {recipe.servings}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-secondary rounded-full px-4 py-3 flex items-center justify-center gap-3">
              <Utensils className="text-darkTeal" size={20} />
              <div className="text-center">
                <p className="text-sm text-darkTeal/70">
                  Total Time{" "}
                  <span className="font-bold text-darkTeal">
                    {recipe.prepTime + recipe.cookTime} min
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column: Description + Instructions (2/3) */}
            <div className="md:col-span-2">
              <div className="rounded-2xl p-6 border border-primary space-y-6">
                {/* Description */}
                {recipe.description && (
                  <div>
                    <h2 className="font-display text-2xl font-bold text-darkTeal mb-3 italic">
                      About this Recipe
                    </h2>
                    <p className="text-darkTeal leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>
                )}

                {/* Divider */}
                {recipe.description && (
                  <div className="border-t border-primary/30"></div>
                )}

                {/* Instructions */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-darkTeal mb-4 italic">
                    Instructions
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-darkTeal leading-relaxed whitespace-pre-line">
                      {recipe.instructions}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Ingredients + Actions (1/3) */}
            <div className="md:col-span-1">
              {/* Ingredients Box */}
              <div className="bg-primary rounded-lg p-6 border border-primary/20 sticky top-4">
                <h2 className="font-display text-2xl font-bold text-light mb-4">
                  Ingredients
                </h2>
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient) => {
                      const qtyText = formatQuantity(ingredient);
                      return (
                        <li
                          key={ingredient.ingredientId}
                          className="flex items-center gap-2 text-light"
                        >
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              className="appearance-none h-5 w-5 border-2 border-light rounded checked:bg-secondary checked:border-secondary transition-colors cursor-pointer"
                              aria-label={`Toggle ${ingredient.ingredientName}`}
                            />
                            <span className="group-has-[:checked]:line-through group-has-[:checked]:opacity-60 transition-all">
                              {qtyText ? (
                                <span className="font-semibold">
                                  {qtyText}{" "}
                                </span>
                              ) : null}
                              {ingredient.ingredientName}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-light/60 italic">No ingredients listed</p>
                )}
              </div>

              {/* Action Buttons - Side by Side, Centered */}
              <div className="mt-6 flex justify-center gap-4">
                <Button
                  variant="buttonText"
                  onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
                  className="flex items-center gap-2 text-sm"
                >
                  [ <Edit size={16} /> Edit ]
                </Button>
                <Button
                  variant="buttonText"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 text-sm"
                >
                  [ <Trash2 size={16} /> Delete ]
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-dark mb-4">
              Delete Recipe?
            </h3>
            <p className="text-dark/60 mb-6">
              Are you sure you want to delete "{recipe.title}"? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isDeleting}
                fullWidth
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
