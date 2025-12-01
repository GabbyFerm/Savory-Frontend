import Layout from "../components/layout/Layout";
import PageHeading from "../components/layout/PageHeading";
import { useAuth } from "../context/AuthContext";

export default function MyRecipes() {
  const { user, logout } = useAuth();

  return (
    <Layout isAuthenticated={true} userName={user?.userName} onLogout={logout}>
      <PageHeading title="My Recipes" />

      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-dark">Recipe list coming soon...</p>
      </div>
    </Layout>
  );
}
