import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();

  return (
    <Layout isAuthenticated={true} userName={user?.userName} onLogout={logout}>
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-dark">Recipe detail for ID: {id}</p>
      </div>
    </Layout>
  );
}
