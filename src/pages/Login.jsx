import { useState } from "react";
import axios from "axios"; // Utiliser axios directement
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import LoadingIndicator from "../components/LoadingIndicator";
import '../styles/Sign.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // URL de base pour l'API
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log("Tentative de connexion pour:", username);

    try {
      console.log("Envoi de la requête de connexion...");
      // Utiliser axios directement pour éviter les intercepteurs qui peuvent causer des boucles
      await axios.post(
        `${baseURL}/api/token/`, 
        { username, password },
        { withCredentials: true }
      );
      
      console.log("Connexion réussie, redirection...");
      // Délai court pour permettre au navigateur de traiter les cookies
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
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
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          {loading && <LoadingIndicator />}
          <div className="form-actions">
            <button type="submit" className="button-shine">Login</button>
          </div>
        </form>
        <div className="form-links">
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  route: PropTypes.string.isRequired,
  method: PropTypes.oneOf(['login']).isRequired
};

export default Login;
