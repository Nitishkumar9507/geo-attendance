import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold tracking-wide">
          GeoAttend
        </h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 mt-20">
        <h2 className="text-4xl md:text-5xl font-extrabold max-w-3xl">
          Geo-Fenced Smart Attendance System
        </h2>

        <p className="mt-6 text-lg text-gray-300 max-w-2xl">
          A secure, location-based attendance platform using real-time GPS,
          role-based access, and smart detection.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-lg"
          >
            Teacher Login
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-gray-300 hover:bg-white hover:text-black px-6 py-3 rounded-xl text-lg"
          >
            Student Login
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="mt-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-xl font-semibold mb-3">📍 Geo-Fencing</h3>
          <p className="text-gray-300">
            Attendance is allowed only within a defined classroom radius.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-xl font-semibold mb-3">🔐 Secure</h3>
          <p className="text-gray-300">
            JWT-based authentication with role-specific access.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-xl font-semibold mb-3">🤖 Smart Detection</h3>
          <p className="text-gray-300">
            Flags abnormal or proxy attendance patterns intelligently.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-6 text-center text-gray-400">
        © 2026 GeoAttend · MERN Stack Project
      </footer>
    </div>
  );
};

export default Home;
