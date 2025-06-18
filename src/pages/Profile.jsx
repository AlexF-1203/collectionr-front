import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../api';
import '../styles/Profile.css';

const ProfileComponent = () => {
  const [activeTab, setActiveTab] = useState('favoris');
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    totalCards: 0,
    cardsBySets: 0,
    favoriteCards: [],
    recentCards: [],
    sets: [],
    collectionValue: 0,
    collectionProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedView, setExpandedView] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const setsPerPage = 4;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Récupération des données utilisateur...");
        console.log("URL de base de l'API:", api.defaults.baseURL);

        console.log("Envoi de la requête au endpoint /api/user/profile/");
        const userResponse = await api.get('/api/user/profile/');
        console.log("Réponse utilisateur reçue:", userResponse.status);

        if (userResponse.data) {
          console.log("Données utilisateur récupérées:", userResponse.data);
          setUser(userResponse.data);

          console.log("Envoi de la requête au endpoint /api/user/profile/data/");
          const profileResponse = await api.get('/api/user/profile/data/');
          console.log("Réponse profil reçue:", profileResponse.status);

          if (profileResponse.data) {
            const data = profileResponse.data;
            console.log("Données profil récupérées:", data);

            const userSets = data.sets || data.collections?.pokemon || [];
            console.log("Sets récupérés:", userSets);

            setProfileData({
              totalCards: data.totalCards || 0,
              cardsBySets: data.cardsBySets || 0,
              favoriteCards: data.favoriteCards?.filter(card => card.tcg === 'pokemon') || [],
              recentCards: data.recentCards?.filter(card => card.tcg === 'pokemon') || [],
              sets: userSets,
              collectionValue: data.collectionValue || 0,
              collectionProgress: data.collectionProgress || 0
            });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);

        if (error.response) {
          console.log("Statut de l'erreur:", error.response.status);
          console.log("Données de l'erreur:", error.response.data);

          if (error.response.status === 401) {
            console.log("Erreur 401: Non autorisé");
            setError("Session expirée. Veuillez vous reconnecter.");
            setTimeout(() => {
              window.location.href = '/login';
            }, 3000);
          } else {
            setError(`Erreur: ${error.response.status} - ${error.response.data.error || 'Problème de serveur'}`);
          }
        } else if (error.request) {
          console.log("Requête sans réponse:", error.request);
          setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
        } else {
          console.log("Erreur:", error.message);
          setError(`Erreur: ${error.message}`);
        }

        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale : 5MB.');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('profile_picture', file);  // Correspond au nom du champ dans le modèle

      console.log("Upload de l'image...");
      console.log("Fichier sélectionné:", file.name, file.size, file.type);

      const response = await api.patch('/api/user/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Réponse complète de l'upload:", response.data);
      console.log("URL de l'image dans la réponse:", response.data.profile_picture);
      console.log("Utilisateur avant mise à jour:", user);

      // Mettre à jour l'état utilisateur avec la nouvelle image
      setUser(prevUser => {
        const updatedUser = {
          ...prevUser,
          profilePicture: response.data.profile_picture
        };
        console.log("Utilisateur après mise à jour:", updatedUser);
        return updatedUser;
      });

      console.log("Photo de profil mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      console.error("Détails de l'erreur:", error.response?.data);

      if (error.response) {
        const errorMessage = error.response.data.profile_picture
          ? error.response.data.profile_picture[0]
          : error.response.data.error || 'Erreur serveur';
        alert(`Erreur lors de l'upload: ${errorMessage}`);
      } else {
        alert("Erreur lors de l'upload de l'image");
      }
    } finally {
      setUploadingImage(false);
      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const filteredSets = useMemo(() => {
    if (selectedSet) {
      return [selectedSet];
    }
    return profileData.sets.filter(set =>
      set.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [profileData.sets, searchTerm, selectedSet]);

  const currentSets = useMemo(() => {
    if (expandedView) {
      return filteredSets;
    }
    const indexOfLastSet = currentPage * setsPerPage;
    const indexOfFirstSet = indexOfLastSet - setsPerPage;
    return filteredSets.slice(indexOfFirstSet, indexOfLastSet);
  }, [filteredSets, currentPage, expandedView]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredSets.length / setsPerPage);
  }, [filteredSets]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
    setExpandedView(false);
    setSelectedSet(null);
    setIsDropdownOpen(false);
  };

  const handleRemoveFavorite = async (cardId) => {
    console.log(`SUPPRIMER CARTE: ${cardId}`);
    try {
      const favoritesResponse = await api.get('/api/favorites/');
      console.log("Tous les favoris:", favoritesResponse.data);

      const favoriToDelete = favoritesResponse.data.find(fav => fav.card.id === cardId);

      if (!favoriToDelete) {
        console.error(`Aucun favori trouvé pour la carte ${cardId}`);
        alert("Impossible de supprimer ce favori");
        return;
      }
      console.log(`Suppression du favori ID=${favoriToDelete.id}`);
      await api.delete(`/api/favorites/${favoriToDelete.id}/`);

      setProfileData(prevData => ({
        ...prevData,
        favoriteCards: prevData.favoriteCards.filter(card => card.id !== cardId)
      }));

      console.log("Suppression réussie");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert(`Erreur lors de la suppression: ${error.message}`);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleExpandedView = () => {
    setExpandedView(!expandedView);
  };

  const handleSetSelect = (set) => {
    setSelectedSet(set);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const clearSelection = () => {
    setSelectedSet(null);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Chargement de votre profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Non connecté</h2>
          <p>Vous devez être connecté pour accéder à votre profil.</p>
          <button className="retry-button" onClick={() => window.location.href = '/login'}>Se connecter</button>
        </div>
      </div>
    );
  }

  const renderActivityTab = () => (
    <div className="content-section">
      <h3>Activité récente</h3>

      {profileData.recentCards.length > 0 ? (
        profileData.recentCards.map(card => (
          <div className="card-preview" key={card.id}>
            <img src={card.image} alt={card.name} />
            <div className="card-info">
              <div className="card-header">
                <h4>{card.name}</h4>
                <span className="card-set">{card.set.title}</span>
              </div>
            </div>
            <div className="card-price-info">
              <div className="price-value">{card.currentPrice.toFixed(2)} €</div>
              <div className={`price-change ${card.priceChange >= 0 ? 'positive' : 'negative'}`}>
                {card.priceChange >= 0 ? "+" : ""}{card.priceChange.toFixed(2)} €
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <i>📋</i>
          <p>Aucune activité récente</p>
        </div>
      )}
    </div>
  );

  const renderCollectionsTab = () => (
    <div className="content-section">
      <h3>Sets Pokémon</h3>

      <div className="search-and-pagination">
        <div className="dropdown-container">
          <button
            className="dropdown-button"
            onClick={toggleDropdown}
          >
            {selectedSet ? selectedSet.title : 'Sélectionner un set'} {isDropdownOpen ? '▲' : '▼'}
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-search">
                <input
                  type="text"
                  placeholder="Filtrer les sets..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="dropdown-items">
                {profileData.sets
                  .filter(set => set.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((set, index) => (
                    <div
                      key={set.id || index}
                      className="dropdown-item"
                      onClick={() => handleSetSelect(set)}
                    >
                      {set.title}
                    </div>
                  ))
                }
              </div>
              {selectedSet && (
                <div className="dropdown-footer">
                  <button
                    className="clear-selection"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                  >
                    Effacer la sélection
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* <div className="view-toggle">
          <button
            className="toggle-button"
            onClick={toggleExpandedView}
            disabled={selectedSet !== null}
          >
            {expandedView ? 'Afficher moins' : 'Afficher tout'}
          </button>
        </div> */}
      </div>

      <div className="collections-grid">
        {currentSets && currentSets.length > 0 ? (
          currentSets.map((set, index) => (
            <div className="card-preview" key={set.id || index}>
              <div className="set-image-container">
                <img
                  src={set.imageUrl || set.image_url}
                  alt={set.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/150x130?text=${set.title}`;
                  }}
                />
              </div>
              <div className="card-info">
                <div className="card-header">
                  <h4>{set.title}</h4>
                  <span className="card-set">{set.releaseDate}</span>
                </div>
                <div className="card-collection">
                  {set.ownedCards !== undefined && set.totalCards !== undefined ? (
                    <>
                      <div className="collection-text">
                        {set.ownedCards}/{set.totalCards} cartes • {set.progress}% complet
                      </div>
                      <div className="progress-bar-wrapper">
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${set.progress}%` }}
                          />
                        </div>
                      </div>
                    </>
                  ) : set.total_cards !== undefined ? (
                    <>
                      <div className="collection-text">
                        0/{set.total_cards} cartes • 0% complet
                      </div>
                      <div className="progress-bar-wrapper">
                        <div className="progress-bar-container">
                          <div className="progress-bar-fill" style={{ width: `0%` }} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>Collection en cours</div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i>🃏</i>
            <p>Aucun set Pokémon</p>
          </div>
        )}
      </div>

      {!expandedView && !selectedSet && filteredSets.length > setsPerPage && (
        <div className="pagination">
          <button
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &laquo; Précédent
          </button>

          <div className="page-info">
            Page {currentPage} sur {totalPages}
          </div>

          <button
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Suivant &raquo;
          </button>
        </div>
      )}
    </div>
  );

  const renderFavoritesTab = () => (
    <div className="content-section">
      <h3>Cartes favorites</h3>

      {profileData.favoriteCards.length > 0 ? (
        profileData.favoriteCards.map(card => (
          <div className="card-preview" key={card.id}>
            <button
              className="remove-btn"
              onClick={() => handleRemoveFavorite(card.id)}
            >
              ×
            </button>
            <img src={card.image} alt={card.name} />
            <div className="card-info">
              <div className="card-header">
                <h4>{card.name}</h4>
                <span className="card-set">{card.set.title}</span>
              </div>
            </div>
            <div className="card-price-info">
              <div className="price-value">{card.currentPrice.toFixed(2)} €</div>
              <div className={`price-change ${card.priceChange >= 0 ? 'positive' : 'negative'}`}>
                {card.priceChange >= 0 ? "+" : ""}{card.priceChange.toFixed(2)} €
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <i>❤️</i>
          <p>Aucune carte favorite</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="unique-container">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="user-avatar" onClick={handleAvatarClick}>
            <img
              src={
                user.profilePicture?.startsWith('http')
                  ? user.profilePicture
                  : `http://localhost:8000${user.profilePicture}`
              }
            />
            <div className="avatar-overlay">
              {uploadingImage ? (
                <div className="upload-spinner">⏳</div>
              ) : (
                <div className="camera-icon">📷</div>
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div className="user-info">
            <div className="user-handle">@{user.username}</div>
            <div className="user-email">{user.email}</div>
          </div>

          <div className="user-stats">
            <div className="stat">
              <div className="stat-value">{profileData.totalCards}</div>
              <div className="stat-label">Cartes</div>
            </div>
            <div className="stat">
              <div className="stat-value">{profileData.cardsBySets}</div>
              <div className="stat-label">Sets</div>
            </div>
            <div className="stat">
              <div className="stat-value">{profileData.collectionValue.toFixed(2)} €</div>
              <div className="stat-label">Valeur</div>
            </div>
          </div>
        </div>

        <div className="profile-main">
          <div className="content-tabs">
            <button
              className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => handleTabChange('activity')}
            >
              Activité
            </button>
            <button
              className={`tab ${activeTab === 'collections' ? 'active' : ''}`}
              onClick={() => handleTabChange('collections')}
            >
              Sets
            </button>
            <button
              className={`tab ${activeTab === 'favoris' ? 'active' : ''}`}
              onClick={() => handleTabChange('favoris')}
            >
              Favoris
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'activity' && renderActivityTab()}
            {activeTab === 'collections' && renderCollectionsTab()}
            {activeTab === 'favoris' && renderFavoritesTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
