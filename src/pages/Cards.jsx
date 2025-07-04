import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Cards.css';
import api from '../api';
import LoadingIndicator from '../components/LoadingIndicator';
import { RARITY_COLORS } from '../constants';

const Cards = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const cardsPerPage = 30;

  const [filters, setFilters] = useState({
    set: 'all',
    rarity: 'all',
    type: 'all',
    name: ''
  });

  const [availableSets, setAvailableSets] = useState([]);

  const fetchCards = async () => {
    try {
      const res = await api.get('/api/cards/');
      return Array.isArray(res.data) ? res.data : res.data.results || [];
    } catch (err) {
      const fallback = await api.get('/pokemon/cards/');
      return Array.isArray(fallback.data) ? fallback.data : fallback.data.results || [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchCards();
        setAllCards(data);

        const nameInURL = new URLSearchParams(location.search).get("name") || "";
        setFilters(prev => ({ ...prev, name: nameInURL }));

        setTotalPages(Math.ceil(data.length / cardsPerPage));

        const uniqueSets = [...new Set(
          data.map(card => {
            if (typeof card.set === 'object' && card.set?.title) return card.set.title;
            if (typeof card.set === 'string') return card.set;
            return card.set_name || "Set inconnu";
          })
        )].map(name => ({ id: name, name }));

        setAvailableSets(uniqueSets);
        setError(null);
      } catch (err) {
        setError("Erreur de chargement des cartes");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location.search]);

  useEffect(() => {
    if (!loading) {
      const allRarities = [...new Set(allCards.map(card => card.rarity))];
      console.log("Raretés détectées :", allRarities);
    }
  }, [loading, allCards]);

  useEffect(() => {
    let filtered = [...allCards];

    if (filters.name && filters.name.trim() !== '') {
      filtered = filtered.filter(card =>
        card.name?.toLowerCase().includes(filters.name.toLowerCase().trim())
      );
    }

    if (filters.set !== 'all') {
      filtered = filtered.filter(card =>
        String(card.set?.title) === String(filters.set)
      );
    }

    if (filters.rarity !== 'all') {
      filtered = filtered.filter(card => card.rarity === filters.rarity);
    }

    const newTotalPages = Math.ceil(filtered.length / cardsPerPage);
    setTotalPages(newTotalPages);

    const validPage = currentPage > newTotalPages ? 1 : currentPage;
    const start = (validPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    setCards(filtered.slice(start, end));

    if (currentPage !== validPage) setCurrentPage(validPage);
  }, [filters, currentPage, allCards]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleCardClick = (card) => {
    navigate(`/cards/${card.id}`);
  };

  const applyFilters = () => {
    setCurrentPage(1);
  };

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

  return (
    <div className="page-container">
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
              <option
                key={typeof set.id === 'string' ? set.id : JSON.stringify(set.id)}
                value={typeof set.id === 'string' ? set.id : ''}
              >
                {typeof set.name === 'string' ? set.name : 'Nom invalide'}
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
            {[...new Set(allCards.map(card => card.rarity))]
              .filter(r => !!r)
              .map(rarity => (
                <option key={rarity} value={rarity}>
                  {rarity}
                </option>
              ))}
          </select>
        </div>

        <button className="apply-filters" onClick={applyFilters}>Appliquer les Filtres</button>
      </div>

      {loading ? (
        <div className="loading-container">
          <LoadingIndicator />
          <p>Chargement des cartes...</p>
        </div>
      ) : (
        <>
          {cards.length === 0 ? (
            <div className="no-cards">Aucune carte ne correspond à vos critères.</div>
          ) : (
            <div className="cards-grid">
              {cards.map((card, i) => (
                <div key={card.id || i} className="card-frame" onClick={() => handleCardClick(card)}>
                  <div className="card-item">
                    <img
                      src={card.image_url || card.images?.large || "https://via.placeholder.com/245x342"}
                      alt={card.name || "Carte Pokémon"}
                      className="card-image"
                    />
                  </div>
                  <div className="card-info">
                    <h3 className="card-name">{card.name || "Sans nom"}</h3>
                    <div className="card-set-info">
                      <p className="card-set">
                        {typeof card.set === 'object' && card.set?.title
                          ? card.set.title
                          : typeof card.set === 'string'
                          ? card.set
                          : 'Set inconnu'}
                      </p>
                      <img
                        src={card.set.symbol_url}
                        alt="Symbole du set"
                        className="symbol-card"
                      />
                    </div>
                    <p
                      className="card-rarity"
                      style={{
                        ...(RARITY_COLORS[card.rarity]
                          ? {
                              background: RARITY_COLORS[card.rarity],
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              fontWeight: 'bold',
                            }
                          : {
                              color: '#888',
                              fontWeight: 'bold',
                            }),
                      }}
                    >
                      {card.rarity || 'Rareté inconnue'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default Cards;
