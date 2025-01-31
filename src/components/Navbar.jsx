import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // À gérer avec votre système d'authentification

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.user-profile')) {
      setIsUserMenuOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="/logo_collectionr.png" alt="Logo" className="logo-collectionr" />
        </Link>
      </div>

      <ul className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/collections" className="nav-item">Collection</Link>
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
              </button>

              {isUserMenuOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <i className="fa-solid fa-user"></i> User Profile
                  </Link>
                  <Link to="/create-offer" className="dropdown-item">
                    <i className="fa-solid fa-shop"></i> Create Offer
                  </Link>
                  <Link to="/purchases" className="dropdown-item">
                    <i className="fa-solid fa-gear"></i> My Purchases
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <i className="fa-solid fa-gear"></i> Settings
                  </Link>
                  <button
                    onClick={() => {
                      // Votre logique de déconnexion ici
                      setIsLoggedIn(false);
                    }}
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
