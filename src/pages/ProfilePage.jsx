import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/Profile.css';

const ProfilePage = () => {
  // États pour gérer les données du profil
  const [activeTab, setActiveTab] = useState('activity');
  const [profileData, setProfileData] = useState({
    totalCards: 0,
    cardsBySets: [],
    favoriteCards: [],
    recentCards: [],
    collections: {
      pokemon: [],
      yugioh: []
    },
    collectionValue: 0,
    collectionProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Charger les données utilisateur et profil
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les informations de base de l'utilisateur
        const userResponse = await api.get('/api/user/profile/');
        setUser(userResponse.data);
        
        // Récupérer les données de la collection
        const profileResponse = await api.get('/api/user/profile/data/');
        setProfileData({
          totalCards: profileResponse.data.totalCards || 0,
          cardsBySets: profileResponse.data.cardsBySets || 0,
          favoriteCards: profileResponse.data.favoriteCards || [],
          recentCards: profileResponse.data.recentCards || [],
          collections: profileResponse.data.collections || {
            pokemon: [],
          },
          collectionValue: profileResponse.data.collectionValue || 0,
          collectionProgress: profileResponse.data.collectionProgress || 0
        });
        
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des données de profil");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleRemoveFavorite = async (cardId) => {
    try {
      await api.delete(`/api/favorites/${cardId}/`);
      // Mettre à jour les favoris en retirant la carte ( A modifier car marche pas)
      setProfileData(prevData => ({
        ...prevData,
        favoriteCards: prevData.favoriteCards.filter(card => card.id !== cardId)
      }));
    } catch (error) {
      console.error("Erreur lors de la suppression du favori:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Chargement du profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    );
  }

  const renderActivityTab = () => (
    <div className="content-section">
      <div className="activity-header">
        <h3>Recent Activity</h3>
      </div>
      <div className="recent-cards">
        {profileData.recentCards && profileData.recentCards.length > 0 ? (
          profileData.recentCards.map((card, index) => (
            <div key={`recent-${index}`} className="card-preview">
              <img src={card.image} alt={card.name} />
              <div className="card-info">
                <div className="card-header">
                  <h4>{card.name}</h4>
                  <span className={`card-type ${card.tcg}`}>{card.tcg}</span>
                </div>
                <p>{card.set}</p>
                <div className="card-metadata">
                  <span className="timestamp">
                    <i className="far fa-clock"></i>
                    Added
                  </span>
                  <span className="completion-status">
                    <i className="fas fa-layer-group"></i>
                    Set completion: {card.setCompletion}%
                  </span>
                  <span className="collection-info">
                    <i className="fas fa-folder"></i>
                    Added to {card.collectionName}
                  </span>
                </div>
              </div>
              <div className="card-actions">
                {card.isFavorite && <i className="fas fa-heart favorite-icon"></i>}
                <div className="price-indicator">
                  <span className="current-price">€{card.currentPrice}</span>
                  <span className={`price-change ${card.priceChange >= 0 ? 'positive' : 'negative'}`}>
                    <i className={`fas fa-caret-${card.priceChange >= 0 ? 'up' : 'down'}`}></i>
                    {Math.abs(card.priceChange)}%
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-history"></i>
            <p>No recent activity</p>
          </div>
        )}
      </div>
      <div className="view-more">
        <button className="view-more-btn">View More Activity</button>
      </div>
    </div>
  );

  const renderCollectionsTab = () => (
    <div className="content-section">
      <div className="collections-grid">
        <div className="tcg-section">
          <h3>
            <i className="fas fa-gamepad"></i>
            Pokemon Collections
          </h3>
          <div className="set-cards">
            {profileData.collections && profileData.collections.pokemon && profileData.collections.pokemon.length > 0 ? (
              profileData.collections.pokemon.map((collection, index) => (
                <div key={`pokemon-${index}`} className="set-card">
                  <div className="set-image">
                    <img src={collection.imageUrl} alt={collection.title} />
                  </div>
                  <div className="set-info">
                    <h4>{collection.title}</h4>
                    <p>{collection.ownedCards}/{collection.totalCards} cards collected</p>
                    <div className="set-stats">
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{ width: `${collection.progress}%` }}
                        ></div>
                      </div>
                      <span className="percentage">{collection.progress}%</span>
                    </div>
                    <p className="release-date">Released: {collection.releaseDate}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="fas fa-box-open"></i>
                <p>No Pokemon collections yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFavoritesTab = () => (
    <div className="content-section">
      <div className="activity-header">
        <h3>Favorite Cards</h3>
        <div className="activity-filters">
          <span className="active">All</span>
          <span>Pokemon</span>
          <span>Yu-Gi-Oh</span>
        </div>
      </div>
      <div className="recent-cards">
        {profileData.favoriteCards && profileData.favoriteCards.length > 0 ? (
          profileData.favoriteCards.map((card, index) => (
            <div key={`favorite-${index}`} className="card-preview">
              <img src={card.image} alt={card.name} />
              <div className="card-info">
                <div className="card-header">
                  <h4>{card.name}</h4>
                  <span className={`card-type ${card.tcg}`}>{card.tcg}</span>
                </div>
                <p>{card.set}</p>
                <div className="card-metadata">
                  <span className="timestamp">
                    <i className="far fa-clock"></i>
                    Added to favorites
                  </span>
                  <span className="completion-status">
                    <i className="fas fa-layer-group"></i>
                    Set completion: {card.setCompletion}%
                  </span>
                  <span className="collection-info">
                    <i className="fas fa-folder"></i>
                    Found in {card.collectionName}
                  </span>
                </div>
              </div>
              <div className="card-actions">
                <button className="remove-btn" onClick={() => handleRemoveFavorite(card.id)}>
                  <i className="fas fa-times"></i>
                </button>
                <div className="price-indicator">
                  <span className="current-price">€{card.currentPrice}</span>
                  <span className={`price-change ${card.priceChange >= 0 ? 'positive' : 'negative'}`}>
                    <i className={`fas fa-caret-${card.priceChange >= 0 ? 'up' : 'down'}`}></i>
                    {Math.abs(card.priceChange)}%
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-heart"></i>
            <p>No favorite cards yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderOffersTab = () => (
    <div className="content-section">
      <div className="activity-header">
        <h3>My offers</h3>
      </div>
      <div className="activity-grid">
        <div className="empty-state">
          <i className="fas fa-handshake"></i>
          <p>No active offers</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="user-info">
          <div className="user-avatar">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} alt="avatar" />
          </div>
          <h2>{user?.firstName} {user?.lastName}</h2>
          <p className="user-handle">@{user?.email?.split('@')[0]}</p>
          <div className="user-stats">
            <div className="stat">
              <span className="stat-value">{profileData.totalCards}</span>
              <span className="stat-label">Cards</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profileData.cardsBySets}</span>
              <span className="stat-label">Sets</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profileData.favoriteCards ? profileData.favoriteCards.length : 0}</span>
              <span className="stat-label">Favorites</span>
            </div>
          </div>
        </div>
        <div className="stat">
          <div className="quick-stats">
            <div className="completion-rate">
              <div className="completion-header">
                <span className="stat-label">Collection Value</span>
                <span className="stat-value">€{profileData.collectionValue ? profileData.collectionValue.toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="quick-stats">
          <div className="completion-rate">
            <div className="completion-header">
              <h3>Collection Progress</h3>
              <span className="percentage">{profileData.collectionProgress || 0}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${profileData.collectionProgress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-main">
        <div className="content-tabs">
          <button
            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => handleTabChange('activity')}
          >
            Recent Activity
          </button>
          <button
            className={`tab ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => handleTabChange('collections')}
          >
            Collections
          </button>
          <button
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => handleTabChange('favorites')}
          >
            Favorites
          </button>
          <button
            className={`tab ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => handleTabChange('offers')}
          >
            Offers
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'activity' && renderActivityTab()}
          {activeTab === 'collections' && renderCollectionsTab()}
          {activeTab === 'favorites' && renderFavoritesTab()}
          {activeTab === 'offers' && renderOffersTab()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;