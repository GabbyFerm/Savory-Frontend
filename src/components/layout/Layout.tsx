import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
}

export default function Layout({
  children,
  isAuthenticated,
  userName,
  onLogout,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Header
        isAuthenticated={isAuthenticated}
        userName={userName}
        onLogout={onLogout}
      />

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
}
