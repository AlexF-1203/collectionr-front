import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardDetailComponent from '../components/CardDetailComponent';
import PriceChartGradient from '../components/PriceChartGradient';
import api from '../api';
import '../styles/CardDetail.css';
import '../components/TCGCard';

if (!customElements.get('tcg-card')) {
  import('../components/TCGCard').then(() => {
    console.log('TCGCard custom element registered in CardDetail');
  });
}

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAddFavorite = async (cardId) => {
  console.log('Card ID:', cardId);
  try {
    const res = await api.get('/api/favorites/');
    const fav = res.data.find(f => f.card.id === cardId);
    if (!fav) {
      await api.post('/api/favorites/', { card_id: cardId });
      alert("Favori ajouté avec succès!");
    }
  } catch (error) {
    console.error('Erreur lors de l’ajout du favori:', error);
    alert("Erreur lors de l'ajout du favori.");
  }
};

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/cards/${id}/`);
        console.log("Card data fetched:", response.data);
        setCard(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des détails de la carte:", err);
        setError("Impossible de charger les détails de la carte.");
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/cards');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loader"></div>
          <p className="loading-text">Chargement des détails de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">!</div>
          <div className="error-message">{error}</div>
          <button className="back-button" onClick={handleBack}>Retour à ma collection</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PriceChartGradient />
      <CardDetailComponent card={card} onBack={handleBack} onAddFavorite={handleAddFavorite} />
    </>
  );
};

export default CardDetail;
