import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Cards.css';
import api from '../api';
import LoadingIndicator from '../components/LoadingIndicator';
import { RARITY_COLORS } from '../constants';

const Cards = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // SUPPRIMÉ allCards - plus besoin !
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
  const [availableRarities, setAvailableRarities] = useState([]);

   const fetchCards = async (page = 1, filters = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", cardsPerPage);

    if (filters.name) params.append("q", filters.name);
    if (filters.set !== "all") params.append("set", filters.set);
    if (filters.rarity !== "all") params.append("rarity", filters.rarity);

    try {
      const res = await api.get(`/api/cards/?${params.toString()}`);
      return {
        results: res.data.results || [],
        count: res.data.count || 0
      };
    } catch (err) {
      console.error("Erreur :", err);
      return { results: [], count: 0 };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchCards(currentPage, filters);
      setCards(data.results);
      setTotalPages(Math.ceil(data.count / cardsPerPage));
      setLoading(false);
    };
    loadData();
  }, [currentPage, filters]);

  // Charger les sets et raretés disponibles au démarrage
  useEffect(() => {
    const loadFilters = async () => {
      try {
        // Charger les sets depuis le nouveau endpoint
        const setsRes = await api.get('/api/cards/sets/');
        console.log("Sets chargés:", setsRes.data);
        setAvailableSets(setsRes.data || []);

        // Charger les raretés depuis le nouveau endpoint
        const raritiesRes = await api.get('/api/cards/rarities/');
        console.log("Raretés chargées:", raritiesRes.data);
        setAvailableRarities(raritiesRes.data || []);

      } catch (err) {
        console.error("Erreur chargement filtres:", err);
      }
    };
    loadFilters();
  }, []);

  // Gérer les paramètres URL (ex: /cards?name=pikachu)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const nameParam = urlParams.get('name');

    if (nameParam) {
      setFilters(prev => ({ ...prev, name: nameParam }));
      setCurrentPage(1);
    }
  }, [location.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Retour page 1 quand on change un filtre
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
                key={set.id}
                value={set.title}
              >
                {set.title}
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
            {availableRarities.map(rarity => (
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
