import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Cards.css';
import api from '../api';
import LoadingIndicator from '../components/LoadingIndicator';

const Cards = () => {
  const navigate = useNavigate();
  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nameFilter = params.get('name') || '';
  const [error, setError] = useState(null);
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
    } catch {
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
        setTotalPages(Math.ceil(data.length / cardsPerPage));

        const uniqueSets = [...new Set(data.map(card => card.set_name || card.set || "Set inconnu"))]
          .map(name => ({ id: name, name }));
        setAvailableSets(uniqueSets);
        setError(null);
      } catch (err) {
        setError("Erreur de chargement des cartes");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...allCards];
    const search = filters.name || nameFilter;

    if (search) {
      filtered = filtered.filter(card =>
        card.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.set !== 'all') {
      filtered = filtered.filter(card =>
        [card.set_id, card.set, card.setCode, card.set_code, card.set_name].includes(filters.set)
      );
    }

    if (filters.rarity !== 'all') {
      filtered = filtered.filter(card => card.rarity === filters.rarity);
    }

    const newTotalPages = Math.ceil(filtered.length / cardsPerPage);
    setTotalPages(newTotalPages);
    if (currentPage > newTotalPages) setCurrentPage(1);

    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    setCards(filtered.slice(start, end));
  }, [filters, nameFilter, currentPage, allCards]);

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
              <option key={set.id} value={set.id}>{set.name}</option>
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
                    <p className="card-set">{card.set_name || card.set || "Set inconnu"}</p>
                    <p className="card-rarity">{card.rarity || "Rareté inconnue"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cards;
