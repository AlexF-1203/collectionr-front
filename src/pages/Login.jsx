import { useState } from "react";
import api from "../api";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Link } from 'react-router-dom';
import LoadingIndicator from "../components/LoadingIndicator";
import '../styles/Sign.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post('api/token/', { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      window.dispatchEvent(new Event('storage'));
      navigate("/");
    } catch (error) {
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
