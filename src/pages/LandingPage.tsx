export default function LandingPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="font-display text-6xl font-black mb-4 italic">Savory</h1>
        <p className="text-xl mb-8">Your personal Recipe Manager</p>
        <div className="flex gap-4 justify-center">
          <button className="bg-secondary hover:bg-secondary/90 text-dark font-semibold px-8 py-3 rounded-lg transition">
            Sign up
          </button>
          <button className="bg-white hover:bg-light text-dark font-semibold px-8 py-3 rounded-lg transition">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
