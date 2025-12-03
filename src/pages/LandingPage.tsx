import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChefHat,
  UserPlus,
  LogIn,
  BookOpen,
  Search,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/auth/LoginModal";
import RegisterModal from "../components/auth/RegisterModal";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Auto-redirect if authenticated - use useEffect!
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Don't render if authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center text-white mb-16">
          {/* Chef Hat Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <ChefHat size={60} className="text-[#F5F5F5]" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-9xl font-black mb-3 italic text-[#F5F5F5]">
            Savory
          </h1>
          <p className="text-xl mb-12 font-light text-[#F5F5F5]">
            Your personal <span className="italic font-semibold">Recipe</span>{" "}
            Manager
          </p>

          {/* Main Content - Image + Text Side by Side */}
          <div className="grid md:grid-cols-6 gap-8 items-center mb-12 max-w-5xl mx-auto">
            {/* Left - Recipe Icon Image (takes 2 columns) */}
            <div className="md:col-span-2 flex justify-center md:justify-end">
              <img
                src="/recipe-icon.png"
                alt="Recipe illustration"
                className="w-70 h-auto"
              />
            </div>

            {/* Right - Description Text (takes 3 columns) */}
            <div className="md:col-span-4 text-left md:mr-12">
              <h2 className="font-display text-3xl font-bold mb-4 italic text-[#F5F5F5]">
                Your Digital Cookbook
              </h2>
              <p className="text-[#F5F5F5] text-lg leading-relaxed mb-4">
                Store and organize all your favorite recipes in one beautiful
                place.
              </p>
              <p className="text-[#F5F5F5] leading-relaxed mb-4">
                Whether it's grandma's secret pasta recipe or that amazing dish
                you discovered last week, Savory keeps everything organized and
                easy to find.
              </p>
              <p className="text-[#F5F5F5] leading-relaxed">
                Search by ingredients, filter by category, and track your
                cooking journey with personal statistics.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setRegisterOpen(true)}
              className="bg-secondary hover:bg-secondary/90 text-dark font-semibold px-10 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg flex items-center gap-2"
            >
              <UserPlus size={24} />
              Sign up
            </button>
            <button
              onClick={() => setLoginOpen(true)}
              className="bg-darkTeal hover:bg-darkTeal/90 text-light font-semibold px-10 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg flex items-center gap-2"
            >
              <LogIn size={24} />
              Login
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 - Digital Cookbook */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white text-center hover:bg-white/20 transition-all">
            <div className="flex justify-center mb-4">
              <div className="bg-secondary/20 p-4 rounded-full">
                <BookOpen size={40} className="text-secondary" />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              Organize Recipes
            </h3>
            <p className="text-white/80 text-sm">
              Keep all your recipes in one organized digital cookbook
            </p>
          </div>

          {/* Feature 2 - Easy Search */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white text-center hover:bg-white/20 transition-all">
            <div className="flex justify-center mb-4">
              <div className="bg-secondary/20 p-4 rounded-full">
                <Search size={40} className="text-secondary" />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              Quick Search
            </h3>
            <p className="text-white/80 text-sm">
              Find recipes instantly by ingredient, category, or name
            </p>
          </div>

          {/* Feature 3 - Personal Stats */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white text-center hover:bg-white/20 transition-all">
            <div className="flex justify-center mb-4">
              <div className="bg-secondary/20 p-4 rounded-full">
                <BarChart3 size={40} className="text-secondary" />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              Track Progress
            </h3>
            <p className="text-white/80 text-sm">
              View insights and statistics about your cooking journey
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </div>
  );
}
