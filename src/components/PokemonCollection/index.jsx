import { useState, useEffect } from 'react';
import PokemonCard from '../PokemonCard';
import './styles.css';
import { ACCESS_TOKEN } from '../../constants';

const PokemonCollection = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCards = async (page) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        throw new Error('Vous devez être connecté pour voir la collection');
      }

      const response = await fetch(`http://localhost:8000/api/pokemon/cards/?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur serveur');
      }

      const data = await response.json();
      setCards(data.results);
      setTotalPages(Math.ceil(data.count / 5));
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div className="loading">Chargement des cartes Pokémon...</div>;
  }

  if (error) {
    return <div className="error">Erreur : {error}</div>;
  }

  if (cards.length === 0) {
    return <div className="no-cards">Aucune carte Pokémon trouvée</div>;
  }

  return (
    <div className="pokemon-collection">
      <div className="cards-grid">
        {cards.map((card) => (
          <PokemonCard
            key={card.id}
            {...card}
          />
        ))}
      </div>
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>
            Précédent
          </button>
        )}
        <span>Page {currentPage} sur {totalPages}</span>
        {currentPage < totalPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>
            Suivant
          </button>
        )}
      </div>
    </div>
  );
};

export default PokemonCollection;
