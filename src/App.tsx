import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      {/* We'll add routes here next */}
      <div className="min-h-screen bg-light">
        <h1 className="text-center py-20">
          <span className="font-display text-6xl font-black text-primary">
            Savory
          </span>
          <p className="text-dark mt-4">Frontend setup complete! 🎉</p>
        </h1>
      </div>
    </Router>
  );
}

export default App;
