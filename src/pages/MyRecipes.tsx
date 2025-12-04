import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, ChefHat } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import PageHeading from "../components/layout/PageHeading";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { Recipe, PagedResult } from "../types";

type SortOption = "title" | "categoryName" | "createdAt" | "cookTime";

export default function MyRecipes() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Fetch recipes
  useEffect(() => {
    // Don't fetch if user isn't loaded yet
    if (!user) {
      console.log("⏳ Waiting for user...");
      return;
    }

    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        if (searchTerm) {
          params.append("searchTerm", searchTerm);
          params.append("ingredientName", searchTerm);
        }

        // Map camelCase sort values to lowercase backend values
        const sortByMap: Record<SortOption, string> = {
          title: "title",
          categoryName: "categoryname",
          createdAt: "createddate",
          cookTime: "cooktime",
        };

        params.append("sortBy", sortByMap[sortBy]);
        params.append("sortOrder", "asc");
        params.append("pageNumber", currentPage.toString());
        params.append("pageSize", pageSize.toString());

        const response = await api.get<PagedResult<Recipe>>(
          `/recipe?${params.toString()}`
        );

        setRecipes(response.data.items);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch (error: any) {
        console.error("❌ Failed to fetch recipes:", error);
        console.error("❌ Error details:", error.response?.data);
        toast.error("Failed to load recipes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [searchTerm, sortBy, currentPage, user]);

  // Add: Refetch when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible - refetch recipes
        setCurrentPage(1); // This will trigger the fetch useEffect
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!user) return null;

  return (
    <Layout
      isAuthenticated={true}
      userName={user.userName}
      avatarColor={user.avatarColor}
      onLogout={logout}
    >
      <PageHeading title="My Recipes" />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Sort Bar and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-5">
          {/* Sort By Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-darkTeal font-display text-2xl italic mr-2">
              Sort by:
            </span>

            <button
              onClick={() => setSortBy("title")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                sortBy === "title"
                  ? "bg-primary text-white"
                  : "bg-primary/20 text-darkTeal border border-primary hover:bg-primary/10"
              }`}
            >
              Title
            </button>

            <button
              onClick={() => setSortBy("categoryName")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                sortBy === "categoryName"
                  ? "bg-primary text-white"
                  : "bg-primary/20 text-darkTeal border border-primary hover:bg-primary/10"
              }`}
            >
              Category
            </button>

            <button
              onClick={() => setSortBy("createdAt")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                sortBy === "createdAt"
                  ? "bg-primary text-white"
                  : "bg-primary/20 text-darkTeal border border-primary hover:bg-primary/10"
              }`}
            >
              Created date
            </button>

            <button
              onClick={() => setSortBy("cookTime")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                sortBy === "cookTime"
                  ? "bg-primary text-white"
                  : "bg-primary/20 text-darkTeal border border-primary hover:bg-primary/10"
              }`}
            >
              Cook time
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-darkTeal/80"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by title or ingredient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-primary rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-primary/20"
            />
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && (
          <p className="text-darkTeal/60 mb-4">
            {totalCount} recipe{totalCount !== 1 ? "s" : ""} found
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-darkTeal">Loading your recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="bg-light/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              {searchTerm ? (
                <Search size={48} className="text-primary" />
              ) : (
                <PlusCircle size={48} className="text-primary" />
              )}
            </div>
            <h3 className="font-display text-2xl font-bold text-darkTeal mb-2">
              {searchTerm ? "No Recipes Found" : "No Recipes Yet"}
            </h3>
            <p className="text-darkTeal/60 mb-6 max-w-md mx-auto">
              {searchTerm
                ? `No recipes match "${searchTerm}". Try a different search term.`
                : "Start building your personal cookbook by adding your first recipe!"}
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate("/create-recipe")}
              className="inline-flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Create Your First Recipe
            </Button>
          </div>
        ) : (
          <>
            {/* Recipe List */}
            <div className="space-y-4">
              {recipes.map((recipe) => {
                const imageUrl = recipe.imagePath
                  ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${
                      recipe.imagePath
                    }`
                  : null;

                return (
                  <div
                    key={recipe.id}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    className="flex flex-col md:flex-row items-start bg-darkTeal/20 rounded-lg overflow-hidden hover:bg-primary/30 transition-colors cursor-pointer border border-primary"
                  >
                    {/* Image wrapper */}
                    <div className="w-full h-36 md:w-80 md:h-full flex-shrink-0 bg-gradient-to-br from-primary/20 to-secondary/20 max-h-[144px] md:max-h-[140px] overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={recipe.title}
                          className="w-full h-full object-cover block"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ChefHat size={40} className="text-primary/40" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow p-4 min-h-0 overflow-hidden max-h-[144px] md:max-h-[140px]">
                      <h2 className="font-display text-xl font-bold text-darkTeal mb-2 leading-tight">
                        {recipe.title}
                      </h2>

                      <p className="text-sm text-darkTeal font-bold mb-2 leading-snug">
                        CookTime: {recipe.cookTime || "No cook time available"}{" "}
                        || PrepTime:{" "}
                        {recipe.prepTime || "No prep time available"} ||
                        Servings: {recipe.servings || "No servings available"}
                      </p>

                      <p className="text-base text-darkTeal line-clamp-2 leading-relaxed">
                        {recipe.description || "No description available"}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Add Recipe Button */}
              <div className="mt-8 text-center">
                <Button
                  variant="buttonText"
                  onClick={() => navigate("/create-recipe")}
                  className="inline-flex items-center gap-2"
                >
                  [ <PlusCircle size={16} />
                  Add New Recipe ]
                </Button>
              </div>
            </div>

            {/* Pagination - Outside recipe list */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
