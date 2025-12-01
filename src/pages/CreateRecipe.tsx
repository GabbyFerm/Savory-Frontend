import Layout from "../components/layout/Layout";
import PageHeading from "../components/layout/PageHeading";
import { useAuth } from "../context/AuthContext";

export default function CreateRecipe() {
  const { user, logout } = useAuth();

  return (
    <Layout isAuthenticated={true} userName={user?.userName} onLogout={logout}>
      <PageHeading title="Create Recipe" />

      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-dark">
          Create recipe form coming soon...
        </p>
      </div>
    </Layout>
  );
}
