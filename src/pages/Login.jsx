import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl w-96 border border-gray-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Iniciar Sesión</h2>

        {error && (
          <p className="text-red-500 mb-4 text-sm">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded-lg bg-gray-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white font-semibold"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
