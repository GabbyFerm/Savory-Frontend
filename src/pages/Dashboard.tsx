import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, ChefHat, Edit, KeyRound, Utensils } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import PageHeading from "../components/layout/PageHeading";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import StatCard from "../components/dashboard/StatCard";
import EditProfileModal from "../components/profile/EditProfileModal";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { DashboardStats } from "../types";
import { extractErrorMessage } from "../utils/errorHandler";

export default function Dashboard() {
  const { user, setUser, logout } = useAuth(); // <-- use setUser
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Fetch dashboard stats
  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const response = await api.get<DashboardStats>("/dashboard/stats");
        if (!cancelled) {
          setStats(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch stats:", error);
          toast.error("Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handle profile update
  const handleUpdateProfile = async (userName: string, email: string, avatarColor: string) => {
    try {
      // call server
      const res = await api.put("/profile", { userName, email, avatarColor });

      // prefer server returned updated user, otherwise merge into local user object
      const updatedUser =
        res?.data ??
        ({
          ...(user ?? JSON.parse(localStorage.getItem("user") || "{}")),
          userName,
          email,
          avatarColor,
        } as typeof user);

      // update auth state (AuthContext persists to localStorage)
      if (setUser) {
        setUser(updatedUser);
      } else {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast.success("Profile updated successfully!");
      setEditProfileOpen(false); // close modal without reloading
    } catch (error: unknown) {
      const message = extractErrorMessage(error, "Failed to update profile");
      toast.error(message);
      throw error;
    }
  };

  // Handle password change
  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.put("/profile/password", { currentPassword, newPassword });
      toast.success("Password changed successfully!");
    } catch (error: unknown) {
      const message = extractErrorMessage(error, "Failed to change password");
      toast.error(message);
      throw error;
    }
  };

  if (!user) return null;

  return (
    <Layout
      isAuthenticated={true}
      userName={user.userName}
      avatarColor={user.avatarColor}
      onLogout={logout}
    >
      <PageHeading title={`${user.userName}'s Dashboard`} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Cards */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-dark/60">Loading stats...</p>
          </div>
        ) : stats ? (
          <>
            {/* Stats Grid - 4 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={BookOpen}
                title="Total Recipes"
                value={stats.totalRecipes}
                subtitle="in your cookbook"
              />
              <StatCard
                icon={Clock}
                title="Avg Cook Time"
                value={`${stats.averageCookTime} min`}
                subtitle="per recipe"
              />
              <StatCard
                icon={ChefHat}
                title="Avg Prep Time"
                value={`${stats.averageTotalTime} min`}
                subtitle="per recipe"
              />
              {/* Stat 4: Recipes by Category - Compact */}
              <div className="bg-light rounded-2xl p-6 border border-secondary">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/20 p-4 rounded-full mb-4">
                    <Utensils size={28} className="text-darkTeal" />
                  </div>
                  <h3 className="text-darkTeal text-sm font-medium mb-3">Recipes by Category</h3>
                  <div className="w-full space-y-1">
                    {Object.entries(stats.recipesByCategory).map(([category, count]) => (
                      <div key={category} className="flex justify-between text-sm">
                        <span className="text-darkTeal/80">{category}</span>
                        <span className="font-bold text-darkTeal/80">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout: Recent Recipes + Profile */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {/* Left: Recent Recipes (3/4 width)*/}
              <div className="md:col-span-3 bg-light rounded-2xl p-6 border border-primary">
                <h3 className="font-display text-2xl font-bold text-darkTeal mb-4">
                  Recent Recipes
                </h3>
                {stats.recentRecipes && stats.recentRecipes.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentRecipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                        className="flex items-center justify-between p-4 bg-darkTeal/10 hover:bg-primary/30 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {recipe.imagePath ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL?.replace(
                                "/api",
                                ""
                              )}${recipe.imagePath}`}
                              alt={recipe.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-darkTeal/10 flex items-center justify-center">
                              <ChefHat className="text-darkTeal" size={24} />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-darkTeal text-lg">{recipe.title}</p>
                            <p className="text-sm text-darkTeal">
                              {recipe.categoryName} • {recipe.cookTime} min cook time
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-darkTeal/60">
                          {new Date(recipe.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-darkTeal mb-4">No recipes yet. Create your first recipe!</p>
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/create-recipe")}
                      className="inline-flex items-center gap-2"
                    >
                      <ChefHat size={18} />
                      Create Recipe
                    </Button>
                  </div>
                )}
              </div>

              {/* Right: User Profile (1/4 width) */}
              <div className="bg-light rounded-2xl p-6 border border-primary">
                <h3 className="font-display text-xl font-bold text-darkTeal mb-4 text-center">
                  My Profile
                </h3>

                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar
                    userName={user.userName}
                    avatarColor={user.avatarColor}
                    size="xl"
                    className="mb-4"
                  />
                  <h4 className="font-semibold text-darkTeal text-lg mb-1">{user.userName}</h4>
                  <p className="text-darkTeal/60 text-sm mb-4">{user.email}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    onClick={() => setEditProfileOpen(true)}
                    className="flex items-center justify-center gap-2 text-sm"
                    fullWidth
                  >
                    <Edit size={18} />
                    Update Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setChangePasswordOpen(true)}
                    className="flex items-center justify-center gap-2 text-sm"
                    fullWidth
                  >
                    <KeyRound size={18} />
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-dark/60">No data available</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        currentUserName={user.userName}
        currentEmail={user.email}
        currentAvatarColor={user.avatarColor}
        onSave={handleUpdateProfile}
      />

      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSave={handleChangePassword}
      />
    </Layout>
  );
}
