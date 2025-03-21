import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logoImage from '../assets/logo_collectionr.png';
import api from '../api';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const authCheckDone = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckDone.current) return; // Éviter les vérifications multiples
      
      // Éviter de vérifier sur la page de login
      if (window.location.pathname === "/login") {
        return;
      }

      try {
        console.log("Navbar: vérification unique de l'authentification");
        const response = await api.get('/api/user/profile/');
        authCheckDone.current = true;
        console.log("Navbar: utilisateur authentifié", response.data);
        setIsLoggedIn(true);
        setUsername(response.data.username || '');
      } catch (error) {
        authCheckDone.current = true;
        console.log("Navbar: utilisateur non authentifié");
        setIsLoggedIn(false);
        setUsername('');
        
        // Ne pas rediriger si on est déjà sur login ou après une erreur d'authentification
        if (error.response?.status === 401 && window.location.pathname !== "/login") {
          console.log("Redirection vers login depuis Navbar");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = async () => {
    try {
      await api.post('/api/logout/');
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logoImage} alt="Logo" className="logo-collectionr" />
        </Link>
      </div>

      <ul className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/collection" className="nav-item">Collection</Link>
        <Link to="/cards" className="nav-item">Card</Link>
        <Link to="/marketplace" className="nav-item">Marketplace</Link>
      </ul>

      <div className="user-profile">
        <div className="nav-buttons">
          {isLoggedIn ? (
            <div className="dropdown-container">
              <button
                type="button"
                onClick={toggleUserMenu}
                className="profile-btn"
              >
                <i className="fa-solid fa-user-large user-icon"></i>
                {/* {username && <span className="username-display">{username}</span>} */}
              </button>

              {isUserMenuOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <i className="fa-solid fa-user"></i> User Profile
                  </Link>
                  <Link to="/create-offer" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <i className="fa-solid fa-shop"></i> Create Offer
                  </Link>
                  <Link to="/purchases" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <i className="fa-solid fa-bag-shopping"></i> My Purchases
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <i className="fa-solid fa-gear"></i> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item dropdown-item-danger"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">LOGIN</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;