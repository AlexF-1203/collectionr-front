import React, { useEffect, useState } from 'react';
import '../styles/Cards.css';
import api from '../api';
import LoadingIndicator from '../components/LoadingIndicator';
import { useNavigate } from 'react-router-dom';

const Cards = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    set: 'all',
    rarity: 'all',
    type: 'all',
    name: ''
  });

  const handleCardClick = (card) => {
    navigate(`/cards/${card.id}`);
  };

  const cardsPerPage = 30;

  const [allCards, setAllCards] = useState([]);

  const [availableSets, setAvailableSets] = useState([]);

  const logCardInfo = (cards) => {
    if (!cards || cards.length === 0) return;

    const sampleCards = cards.slice(0, 5);
    console.log("Échantillon de cartes:", sampleCards);

    const allProperties = new Set();
    sampleCards.forEach(card => {
      if (card) {
        Object.keys(card).forEach(key => allProperties.add(key));
      }
    });
    
    console.log("Toutes les propriétés disponibles:", Array.from(allProperties));

    const uniqueSets = new Set();
    cards.forEach(card => {
      if (card && card.set_name) uniqueSets.add(card.set_name);
      if (card && card.set) uniqueSets.add(card.set);
    });
    
    console.log("Sets uniques trouvés:", Array.from(uniqueSets));
  };

  // Extrait set unique
  const extractAllSets = (cardsData) => {
    if (!cardsData || !Array.isArray(cardsData) || cardsData.length === 0) {
      return [];
    }
    
    // Enregistre tous les sets 
    const sets = [];
    const seenSets = new Set();
    
    cardsData.forEach(card => {
      if (!card) return;
      
      // Récupérer toutes les information de set
      const possibleSetIds = [
        card.set_id,
        card.set,
        card.setCode,
        card.set_code
      ].filter(Boolean); // Supp les null/undefined
      
      const setName = card.set_name || card.setName || "Set inconnu";
      
      // Ajoute le set par l'id
      if (possibleSetIds.length > 0) {
        possibleSetIds.forEach(id => {
          if (id && !seenSets.has(id)) {
            seenSets.add(id);
            sets.push({ id, name: setName });
          }
        });
      } 
      // Ajoute le set par le name
      else if (setName && !seenSets.has(setName)) {
        seenSets.add(setName);
        sets.push({ id: setName, name: setName });
      }
    });
    
    // Filtre doublons + trie
    return sets
      .filter((set, index, self) => 
        index === self.findIndex(s => s.id === set.id)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Charge les cartes + extrait les sets
  useEffect(() => {
    const fetchAllCards = async () => {
      setLoading(true);
      console.log("Chargement de toutes les cartes...");
      
      try {
        // Essayer d'abord le premier endpoint
        let allCardsData = [];
        
        const fetchFromMainAPI = async () => {
          try {
            const response = await api.get('/api/cards/');
            return Array.isArray(response.data) 
              ? response.data 
              : (response.data.results || []);
          } catch (err) {
            console.warn("Erreur avec l'API principale:", err);
            return [];
          }
        };
        
        const fetchFromFallbackAPI = async () => {
          try {
            const response = await api.get('/pokemon/cards/');
            return Array.isArray(response.data) 
              ? response.data 
              : (response.data.results || []);
          } catch (err) {
            console.warn("Erreur avec l'API de fallback:", err);
            return [];
          }
        };
        
        // Essayer les deux endpoints
        const mainAPICards = await fetchFromMainAPI();
        
        if (mainAPICards.length > 0) {
          allCardsData = mainAPICards;
          console.log(`Récupéré ${allCardsData.length} cartes depuis l'API principale`);
        } else {
          const fallbackCards = await fetchFromFallbackAPI();
          allCardsData = fallbackCards;
          console.log(`Récupéré ${allCardsData.length} cartes depuis l'API de fallback`);
        }
        
        if (allCardsData.length > 0) {
          // Vérifier structure carte pour débogage
          logCardInfo(allCardsData);
          // Mémo all cartes
          setAllCards(allCardsData);
          // Extraire et mémoriser tous les sets disponibles
          const extractedSets = extractAllSets(allCardsData);
          console.log(`${extractedSets.length} sets trouvés:`, extractedSets);
          setAvailableSets(extractedSets);
          // Calculer nombre pages
          setTotalPages(Math.ceil(allCardsData.length / cardsPerPage));
          // Affiche first page
          const firstPageCards = allCardsData.slice(0, cardsPerPage);
          setCards(firstPageCards);
          
          setError(null);
        } else {
          setError("Aucune carte n'a pu être chargée.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement initial:", error);
        setError("Impossible de charger les cartes. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllCards();
  }, []);
  
  // Filtrer et paginer les cartes lorsque les filtres ou la page changent
  useEffect(() => {
    if (allCards.length === 0) return;

    let filteredCards = [...allCards];

    if (filters.name && filters.name.trim() !== '') {
      const searchTerm = filters.name.toLowerCase().trim();
      filteredCards = filteredCards.filter(card => 
        card && card.name && card.name.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.set !== 'all') {
      filteredCards = filteredCards.filter(card => {
        if (!card) return false;
        // Vérifier toutes les propriétés possibles qui pourraient contenir l'ID du set
        return (
          (card.set_id && card.set_id === filters.set) ||
          (card.set && card.set === filters.set) ||
          (card.setCode && card.setCode === filters.set) ||
          (card.set_code && card.set_code === filters.set) ||
          (card.set_name && card.set_name === filters.set)
        );
      });
    }    
    // Filtre par rareté
    if (filters.rarity !== 'all') {
      filteredCards = filteredCards.filter(card => 
        card && card.rarity && card.rarity === filters.rarity
      );
    }    
    // Calcule nombre pages avec filtres
    const newTotalPages = Math.ceil(filteredCards.length / cardsPerPage);
    setTotalPages(newTotalPages);
    
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
    // Paginer les cartes filtrées
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = Math.min(startIndex + cardsPerPage, filteredCards.length);
    const paginatedCards = filteredCards.slice(startIndex, endIndex);
    
    setCards(paginatedCards);
    
  }, [filters, currentPage, allCards]);
  // Gestion du changement de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  // Gestion du changement de filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  // Application des filtres
  const applyFilters = () => {
    setCurrentPage(1); // Retour à la première page
  };
  // Rendu de la pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        {currentPage > 1 && (
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            className="page-btn prev-btn"
          >
            <i className="fas fa-chevron-left"></i> Précédent
          </button>
        )}
        
        <div className="page-numbers">
          {(() => {
            let pagesToShow = [];
            if (totalPages <= 5) {
              pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
            } else if (currentPage <= 3) {
              pagesToShow = [1, 2, 3, 4, 5];
            } else if (currentPage >= totalPages - 2) {
              pagesToShow = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
              pagesToShow = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
            }

            return pagesToShow.map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`page-number ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ));
          })()}
        
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className="ellipsis">...</span>
          )}
        </div>
        
        {currentPage < totalPages && (
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            className="page-btn next-btn"
          >
            Suivant <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>
    );
  };

  const getImageUrl = (card) => {
    if (card.image_url && typeof card.image_url === 'string' && card.image_url.trim() !== '') {
      return card.image_url;
    }

    if (card.images && card.images.large) {
      return card.images.large;
    }

    if (card.set_id && card.number) {
      return `https://images.pokemontcg.io/${card.set_id}/${card.number}_hires.png`;
    }
    
    if (card.set && card.number) {
      return `https://images.pokemontcg.io/${card.set}/${card.number}_hires.png`;
    }
    
    if (card.set_name && card.number) {
      const setCode = card.set_name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10);
      return `https://images.pokemontcg.io/${setCode}/${card.number}_hires.png`;
    }

    return 'https://via.placeholder.com/245x342?text=Pokemon+Card&bg=transparent';
  };

  const debugInfo = () => {
    return (
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
        maxHeight: '200px',
        overflow: 'auto'
      }}>
        <div><b>Total cards:</b> {allCards.length}</div>
        <div><b>Sets trouvés:</b> {availableSets.length}</div>
        <div><b>Page actuelle:</b> {currentPage}/{totalPages}</div>
        <div><b>Cartes affichées:</b> {cards.length}</div>
        <div><b>Filtres:</b> {JSON.stringify(filters)}</div>
        <hr/>
        <div><b>Sets disponibles:</b></div>
        <ul style={{margin: 0, paddingLeft: '15px'}}>
          {availableSets.map((set, i) => (
            <li key={i}>{set.name} ({set.id})</li>
          ))}
        </ul>
      </div>
    );
  };

  if (error && !cards.length) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="cards-page">
      <h1 className="page-title">Ma Collection de Cartes</h1>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="name">Nom:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Rechercher une carte..."
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="set">Set:</label>
          <select 
            id="set" 
            name="set" 
            value={filters.set}
            onChange={handleFilterChange}
          >
            <option value="all">Tous les Sets</option>
            {availableSets.map(set => (
              <option key={set.id} value={set.id}>
                {set.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="rarity">Rareté:</label>
          <select 
            id="rarity" 
            name="rarity" 
            value={filters.rarity}
            onChange={handleFilterChange}
          >
            <option value="all">Toutes les Raretés</option>
            <option value="COMMON">Commune</option>
            <option value="UNCOMMON">Peu Commune</option>
            <option value="RARE">Rare</option>
            <option value="HOLORARE">Holo Rare</option>
            <option value="ULTRARARE">Ultra Rare</option>
            <option value="SECRETRARE">Secret Rare</option>
          </select>
        </div>
        
        <button className="apply-filters" onClick={applyFilters}>
          Appliquer les Filtres
        </button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <LoadingIndicator />
          <p>Chargement des cartes...</p>
        </div>
      ) : (
        <>
          {cards.length === 0 ? (
            <div className="no-cards">
              <p>Aucune carte ne correspond à vos critères.</p>
            </div>
          ) : (
            <div className="cards-container">
               <div className="cards-grid">
                {cards.map((card, index) => (
                  <div 
                    key={card.id || index} 
                    className="card-frame"
                    onClick={() => handleCardClick(card)}
                    style={{ cursor: 'pointer' }} 
                  >
                    <div className="card-item">
                      <img 
                        src={getImageUrl(card)} 
                        alt={card.name || 'Carte Pokémon'}
                        className="card-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/245x342?text=Pokemon+Card&bg=transparent';
                        }}
                      />
                    </div>
                    <div className="card-info">
                      <h3 className="card-name">{card.name || 'Sans nom'}</h3>
                      <p className="card-set">{card.set_name || card.set || 'Set inconnu'}</p>
                      <p className="card-rarity">
                        {(card.rarity === 'Common' || card.rarity === 'COMMON') && 'Commune'}
                        {(card.rarity === 'Uncommon' || card.rarity === 'UNCOMMON') && 'Peu Commune'}
                        {(card.rarity === 'Rare' || card.rarity === 'RARE') && 'Rare'}
                        {(card.rarity === 'Rare Holo' || card.rarity === 'HOLORARE') && 'Holo Rare'}
                        {(card.rarity === 'Rare Ultra' || card.rarity === 'ULTRARARE') && 'Ultra Rare'}
                        {(card.rarity === 'Rare Secret' || card.rarity === 'SECRETRARE') && 'Secret Rare'}
                        {!['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Rare Ultra', 'Rare Secret', 
                           'COMMON', 'UNCOMMON', 'RARE', 'HOLORARE', 'ULTRARARE', 'SECRETRARE'].includes(card.rarity) && 
                         (card.rarity || 'Rareté inconnue')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {renderPagination()}
        </>
      )}
      
    </div>
  );
};

export default Cards;