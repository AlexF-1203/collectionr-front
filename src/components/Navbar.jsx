import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logoImage from '../assets/logo_collectionr.png';
import api from '../api';

const Navbar = ({ onOpenSettings }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const authCheckDone = useRef(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/cards?name=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckDone.current || window.location.pathname === "/login") return;

      try {
        const response = await api.get('/api/user/profile/');
        authCheckDone.current = true;
        setIsLoggedIn(true);
        setUsername(response.data.username || '');
      } catch (err) {
        authCheckDone.current = true;
        setIsLoggedIn(false);
        setUsername('');
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
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/collection" className="nav-item">Collection</Link>
          <Link to="/cards" className="nav-item">Cards</Link>
          <Link to="/marketplace" className="nav-item">Marketplace</Link>
        </ul>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Chercher une carte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <i className="fa fa-search"></i>
          </button>
        </form>
      </div>

      <div className="user-profile">
        <div className="nav-buttons">
          {isLoggedIn ? (
            <div className="dropdown-container">
              <button onClick={toggleUserMenu} className="profile-btn">
                <i className="fa-solid fa-user-large user-icon"></i>
              </button>

              {isUserMenuOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <i className="fa-solid fa-user"></i> User Profile
                  </Link>
                  {/* <Link to="/create-offer" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <i className="fa-solid fa-shop"></i> Create Offer
                  </Link>
                  <Link to="/purchases" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <i className="fa-solid fa-bag-shopping"></i> My Purchases
                  </Link> */}
                  <button onClick={onOpenSettings}><i className="fa-solid fa-gear"></i> Settings</button>

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
