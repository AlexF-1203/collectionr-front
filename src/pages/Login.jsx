import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import LoadingIndicator from "../components/LoadingIndicator";
import '../styles/Sign.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Tentative de connexion pour:", username);

    try {
      console.log("Envoi de la requête de connexion...");
      const response = await axios.post(
        `${baseURL}/api/token/`, 
        { username, password },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        console.log("Connexion réussie, redirection...");
        // Attendre un court instant pour que les cookies soient traités
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      alert(error.response?.data?.detail || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          {loading && <LoadingIndicator />}
          <div className="form-actions">
            <button type="submit" className="button-shine" disabled={loading}>
              {loading ? "Connexion..." : "Login"}
            </button>
          </div>
        </form>
        <div className="form-links">
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
