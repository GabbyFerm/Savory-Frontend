import Layout from "../components/layout/Layout";
import PageHeading from "../components/layout/PageHeading";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <Layout
      isAuthenticated={true}
      userName={user?.userName}
      avatarColor={user?.avatarColor}
      onLogout={logout}
    >
      <PageHeading title={`${user?.userName}'s Dashboard`} />

      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-dark">
          Dashboard content coming soon...
        </p>
      </div>
    </Layout>
  );
}
