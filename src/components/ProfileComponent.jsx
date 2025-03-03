import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import { ACCESS_TOKEN } from '../constants';

const ProfileComponent = ({ user }) => {
  const [activeTab, setActiveTab] = useState('activity');
  const [profileData, setProfileData] = useState({
    totalCards: 0,
    cardsBySets: 0,
    favoriteCards: [],
    recentCards: [],
    collections: {
      pokemon: [],
      yugioh: []
    },
    collectionValue: 0,
    collectionProgress: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction manquante qui était référencée dans renderFavoritesTab
  const handleRemoveFavorite = async (cardId) => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await fetch(`/api/user/favorite/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Mettre à jour l'état en retirant la carte des favoris
        setProfileData(prevData => ({
          ...prevData,
          favoriteCards: prevData.favoriteCards.filter(card => card.id !== cardId)
        }));
      } else {
        console.error('Erreur lors de la suppression du favori');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
    }
  };

  useEffect(() => {
    let isMounted = true; // Pour éviter les mises à jour d'état après démontage
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem(ACCESS_TOKEN);
        // Correction de l'URL: ajout du / au début
        const response = await fetch('/api/user/profile/data/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!isMounted) return;
        
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          // Gestion explicite des erreurs HTTP
          const errorText = await response.text();
          console.error(`Erreur HTTP ${response.status}: ${errorText}`);
          setError(`Erreur lors du chargement (${response.status})`);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Erreur lors de la récupération des données du profil:', error);
        setError('Erreur de connexion');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Ajout d'un timeout pour éviter le chargement infini en cas d'erreur silencieuse
    const timeoutId = setTimeout(() => {
      if (isLoading && isMounted) {
        console.warn('Chargement interrompu (timeout)');
        setIsLoading(false);
        setError('Le chargement a pris trop de temps');
      }
    }, 15000); // 15 secondes de timeout

    fetchProfileData();

    // Nettoyage
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [user]);

  if (isLoading) {
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
        <div className="error-message">
          {error}
        </div>
        <button 
          className="retry-button"
          onClick={() => {
            setIsLoading(true);
            setError(null);
            // Force l'effet à se réexécuter
            setProfileData(prev => ({...prev}));
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <div className="error-message">
          Impossible de charger les données utilisateur
        </div>
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
                    Added {/* Utilisez une librairie comme date-fns pour formater la date */}
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
        {/* Section Pokemon */}
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

        {/* Section Yu-Gi-Oh */}
        <div className="tcg-section">
          <h3>
            <i className="fas fa-dragon"></i>
            Yu-Gi-Oh Collections
          </h3>
          <div className="set-cards">
            {profileData.collections && profileData.collections.yugioh && profileData.collections.yugioh.length > 0 ? (
              profileData.collections.yugioh.map((collection, index) => (
                <div key={`yugioh-${index}`} className="set-card">
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
                <p>No Yu-Gi-Oh collections yet</p>
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
                    Added to favorites {/* date formatting */}
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
        {/* Implementation placeholder */}
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
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="avatar" />
          </div>
          <h2>{user.firstName} {user.lastName}</h2>
          <p className="user-handle">@{user.email.split('@')[0]}</p>
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
            onClick={() => setActiveTab('activity')}
          >
            Recent Activity
          </button>
          <button
            className={`tab ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            Collections
          </button>
          <button
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
          <button
            className={`tab ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
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

export default ProfileComponent;