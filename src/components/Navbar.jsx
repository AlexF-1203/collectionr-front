import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import SearchBar from './SearchBar';
import logoImage from '../assets/logo_collectionr.png';
import api from '../api';

const Navbar = ({ onOpenSettings }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const authCheckDone = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckDone.current || window.location.pathname === "/login") return;

      try {
        const response = await api.get('/api/user/profile/');
        authCheckDone.current = true;
        setIsLoggedIn(true);
        setUser(response.data);
      } catch (err) {
        authCheckDone.current = true;
        setIsLoggedIn(false);
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
    } catch (err) {
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

      <div className="nav-content">
        <ul className="nav-links">
          <Link to="/" className="nav-item">Acceuil</Link>
          <Link to="/cards" className="nav-item">Cartes</Link>
          <Link to="/news" className="nav-item">Actualités</Link>
        </ul>
        <SearchBar />
      </div>

      <div className="user-profile">
        <div className="nav-buttons">
          {isLoggedIn ? (
            <div className="dropdown-container">
              <button onClick={toggleUserMenu} className="profile-btn">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture.startsWith('http')
                      ? user.profilePicture
                      : `${import.meta.env.VITE_API_URL}${user.profilePicture}`}
                    alt="Profile"
                    className="user-avatar-icon"
                  />
                ) : (
                  <i className="fa-solid fa-user-large user-icon"></i>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <i className="fa-solid fa-user"></i> User Profile
                  </Link>
                  <button onClick={onOpenSettings}>
                    <i className="fa-solid fa-gear"></i> Settings
                  </button>
                  <button onClick={handleLogout} className="dropdown-item dropdown-item-danger">
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
