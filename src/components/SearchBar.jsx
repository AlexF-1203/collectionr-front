import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const SearchBar = () => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim() === '') {
        setSuggestions([]);
        return;
      }

      try {
        const res = await api.get('/api/cards/search/', {
          params: { q: input }
        });
        setSuggestions(res.data.slice(0, 10));
        setShowSuggestions(true);
      } catch (err) {
        console.error('Erreur suggestions :', err);
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [input]);

  // Fermer suggestions quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    navigate(`/cards?name=${encodeURIComponent(input)}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (cardId) => {
    navigate(`/cards/${cardId}`);
    setShowSuggestions(false);
  };

  return (
    <div className="search-form" ref={wrapperRef}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher une carte..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => input.length > 0 && setShowSuggestions(true)}
        />
        <button type="submit" className="search-button">
            <i className="fa fa-search"></i>
          </button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
      <ul className="suggestions-list">
  {suggestions.slice(0, 20).map((card) => (
    <li key={card.id} onClick={() => handleSuggestionClick(card.id)}>
      <img
        src={card.image_url || card.images?.small || "https://via.placeholder.com/50x70"}
        alt={card.name}
        className="card-thumb"
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{card.name}</span>
        <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', color: '#ccc' }}>
          {card.set?.title || 'Set inconnu'}
          {card.set?.symbol_url && (
            <img
              src={card.set.symbol_url}
              alt="Symbole du set"
              className="symbol"
            />
          )}
        </span>
      </div>
    </li>
  ))}
</ul>     )}
    </div>
  );
};

export default SearchBar;
