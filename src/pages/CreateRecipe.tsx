import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import PageHeading from "../components/layout/PageHeading";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ImageUpload from "../components/common/ImageUpload";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { Category, Ingredient } from "../types";

interface RecipeIngredientForm {
  ingredientId: string;
  quantity: number;
  tempId: string;
}

export default function CreateRecipe() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState<number>(0);
  const [cookTime, setCookTime] = useState<number>(0);
  const [servings, setServings] = useState<number>(1);
  const [categoryId, setCategoryId] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredientForm[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Dropdown data
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New ingredient modal state
  const [showNewIngredientModal, setShowNewIngredientModal] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientUnit, setNewIngredientUnit] = useState("");
  const [isCreatingIngredient, setIsCreatingIngredient] = useState(false);

  // Fetch categories and ingredients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, ingredientsRes] = await Promise.all([
          api.get<Category[]>("/category"),
          api.get<Ingredient[]>("/ingredient"),
        ]);
        setCategories(categoriesRes.data);
        setIngredients(ingredientsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load form data");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Add ingredient row
  const addIngredient = () => {
    setRecipeIngredients([
      ...recipeIngredients,
      { ingredientId: "", quantity: 0, tempId: Date.now().toString() },
    ]);
  };

  // Remove ingredient row
  const removeIngredient = (tempId: string) => {
    setRecipeIngredients(recipeIngredients.filter((i) => i.tempId !== tempId));
  };

  // Update ingredient
  const updateIngredient = (
    tempId: string,
    field: "ingredientId" | "quantity",
    value: string | number
  ) => {
    setRecipeIngredients(
      recipeIngredients.map((i) =>
        i.tempId === tempId ? { ...i, [field]: value } : i
      )
    );
  };

  // Create new ingredient
  const handleCreateIngredient = async () => {
    if (!newIngredientName.trim() || !newIngredientUnit.trim()) {
      toast.error("Please fill in all ingredient fields");
      return;
    }

    setIsCreatingIngredient(true);

    try {
      const response = await api.post<Ingredient>("/ingredient", {
        name: newIngredientName,
        unit: newIngredientUnit,
      });

      const createdIngredient = response.data;

      // Add to ingredients list
      setIngredients([...ingredients, createdIngredient]);

      // Close modal and reset
      setShowNewIngredientModal(false);
      setNewIngredientName("");
      setNewIngredientUnit("");

      toast.success(`Ingredient "${createdIngredient.name}" created!`);
    } catch (error: any) {
      console.error("Failed to create ingredient:", error);
      const message =
        error.response?.data?.message || "Failed to create ingredient";
      toast.error(message);
    } finally {
      setIsCreatingIngredient(false);
    }
  };

  // Get the ingredient details to check the unit
  const validateIngredients = () => {
    for (const recipeIng of recipeIngredients) {
      if (!recipeIng.ingredientId) {
        toast.error("Please select an ingredient for all rows");
        return false;
      }

      // Find the ingredient in the list
      const ingredient = ingredients.find(
        (ing) => ing.id === recipeIng.ingredientId
      );

      // If unit is not "to taste" or "pinch", require quantity > 0
      if (
        ingredient &&
        ingredient.unit.toLowerCase() !== "to taste" &&
        ingredient.unit.toLowerCase() !== "pinch" &&
        recipeIng.quantity <= 0
      ) {
        toast.error(`Please enter a quantity for ${ingredient.name}`);
        return false;
      }

      // Quantity cannot be negative
      if (recipeIng.quantity < 0) {
        toast.error("Quantity cannot be negative");
        return false;
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Please enter a recipe title");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (recipeIngredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }
    if (!validateIngredients()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create recipe
      const recipeData = {
        title,
        description,
        instructions,
        prepTime,
        cookTime,
        servings,
        categoryId,
        ingredients: recipeIngredients.map((i) => ({
          ingredientId: i.ingredientId,
          quantity: i.quantity,
        })),
      };

      const recipeResponse = await api.post("/recipe", recipeData);
      const createdRecipe = recipeResponse.data;

      // Step 2: Upload image if selected
      if (selectedImage && createdRecipe.id) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        await api.post(`/recipe/${createdRecipe.id}/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Recipe created successfully!");
      navigate(`/recipe/${createdRecipe.id}`);
    } catch (error: any) {
      console.error("Failed to create recipe:", error);
      const message =
        error.response?.data?.message || "Failed to create recipe";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  if (isLoadingData) {
    return (
      <Layout
        isAuthenticated={true}
        userName={user.userName}
        avatarColor={user.avatarColor}
        onLogout={logout}
      >
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-darkTeal">Loading form...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      isAuthenticated={true}
      userName={user.userName}
      avatarColor={user.avatarColor}
      onLogout={logout}
    >
      <PageHeading title="Create New Recipe" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-darkTeal font-semibold mb-2">
              Recipe Image
            </label>
            <ImageUpload
              onImageSelect={setSelectedImage}
              onImageRemove={() => setSelectedImage(null)}
              disabled={isSubmitting}
            />
          </div>

          {/* Title */}
          <Input
            label="Recipe Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Pasta Alfredo"
            required
            disabled={isSubmitting}
          />

          {/* Category */}
          <div>
            <label className="block text-darkTeal font-semibold mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time and Servings Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Prep Time (min)"
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(Number(e.target.value))}
              min="0"
              required
              disabled={isSubmitting}
            />
            <Input
              label="Cook Time (min)"
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(Number(e.target.value))}
              min="0"
              required
              disabled={isSubmitting}
            />
            <Input
              label="Servings"
              type="number"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              min="1"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-darkTeal font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your recipe..."
              rows={3}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-darkTeal font-semibold mb-2">
              Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Step-by-step cooking instructions..."
              rows={6}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-darkTeal font-semibold">
                Ingredients <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewIngredientModal(true)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 text-sm"
                >
                  <PlusCircle size={16} />
                  New Ingredient
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addIngredient}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Add to Recipe
                </Button>
              </div>
            </div>

            {recipeIngredients.length === 0 ? (
              <p className="text-darkTeal/60 text-center py-8 border-2 border-dashed border-primary/30 rounded-lg">
                No ingredients added yet. Click "Add to Recipe" to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {recipeIngredients.map((ingredient) => {
                  // Find the selected ingredient to check its unit
                  const selectedIngredient = ingredients.find(
                    (ing) => ing.id === ingredient.ingredientId
                  );
                  const isToTaste =
                    selectedIngredient?.unit.toLowerCase() === "to taste" ||
                    selectedIngredient?.unit.toLowerCase() === "pinch";

                  return (
                    <div
                      key={ingredient.tempId}
                      className="flex gap-3 items-end"
                    >
                      <div className="flex-grow">
                        <select
                          value={ingredient.ingredientId}
                          onChange={(e) =>
                            updateIngredient(
                              ingredient.tempId,
                              "ingredientId",
                              e.target.value
                            )
                          }
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                          <option value="">Select ingredient</option>
                          {ingredients.map((ing) => (
                            <option key={ing.id} value={ing.id}>
                              {ing.name} ({ing.unit})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-32 relative">
                        <input
                          type="number"
                          value={ingredient.quantity}
                          onChange={(e) =>
                            updateIngredient(
                              ingredient.tempId,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          min="0"
                          step="0.1"
                          required={!isToTaste}
                          disabled={isSubmitting}
                          placeholder={isToTaste ? "Optional" : "Qty"}
                          className={`w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            isToTaste ? "bg-gray-50" : ""
                          }`}
                        />
                        {isToTaste && (
                          <span className="absolute -bottom-5 left-0 text-xs text-darkTeal/60 italic">
                            (optional)
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient.tempId)}
                        disabled={isSubmitting}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/my-recipes")}
              disabled={isSubmitting}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Create Recipe
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* New Ingredient Modal */}
      {showNewIngredientModal && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-dark mb-4">
              Create New Ingredient
            </h3>

            <div className="space-y-4 mb-6">
              <Input
                label="Ingredient Name"
                type="text"
                value={newIngredientName}
                onChange={(e) => setNewIngredientName(e.target.value)}
                placeholder="e.g., Olive Oil"
                disabled={isCreatingIngredient}
              />

              <div>
                <label className="block text-darkTeal font-semibold mb-2">
                  Unit of Measurement
                </label>
                <select
                  value={newIngredientUnit}
                  onChange={(e) => setNewIngredientUnit(e.target.value)}
                  disabled={isCreatingIngredient}
                  className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">Select unit</option>
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="dl">Deciliters (dl)</option>
                  <option value="l">Liters (l)</option>
                  <option value="tsp">Teaspoon (tsp)</option>
                  <option value="tbsp">Tablespoon (tbsp)</option>
                  <option value="cup">Cup</option>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="pinch">Pinch</option>
                  <option value="to taste">To taste</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNewIngredientModal(false);
                  setNewIngredientName("");
                  setNewIngredientUnit("");
                }}
                disabled={isCreatingIngredient}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCreateIngredient}
                disabled={isCreatingIngredient}
                fullWidth
              >
                {isCreatingIngredient ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
