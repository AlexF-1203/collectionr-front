import React, { useState, useEffect } from 'react';
import '../styles/CardDetail.css';

const CardDetailComponent = ({ card, onBack = () => {} }) => {
  const [priceHistory, setPriceHistory] = useState([]);

  // Générer des données d'historique de prix pour la démo
  useEffect(() => {
    if (!card) return;
    
    const generatePriceHistoryData = () => {
      const today = new Date();
      const data = [];
      // Déterminer le prix de base à partir de la carte ou utiliser une valeur par défaut
      const basePrice = card.price?.amount 
        ? parseFloat(card.price.amount) 
        : 2.50;
      
      let currentPrice = basePrice;
      
      // Générer 30 jours de données
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Variation plus réaliste pour créer un graphique plus intéressant
        // Ajouter un peu de volatilité aléatoire et une tendance générale
        const randomFactor = Math.random() * 0.2 - 0.1; // -10% à +10%
        const trendFactor = Math.sin(i / 5) * 0.05; // Tendance sinusoïdale
        
        const dailyChange = currentPrice * (randomFactor + trendFactor);
        currentPrice = Math.max(0.1, currentPrice + dailyChange);
        
        data.push({
          date: date.toISOString().split('T')[0],
          price: currentPrice.toFixed(2)
        });
      }
      
      setPriceHistory(data);
    };

    generatePriceHistoryData();
  }, [card]);

  // Déterminer la couleur de la rareté
  const getRarityColor = (rarity) => {
    if (!rarity) return '#fff';
    
    const rarityMap = {
      'COMMON': '#B1B1B1',
      'UNCOMMON': '#73B973',
      'RARE': '#5B8CFF',
      'HOLORARE': '#8A5BFF',
      'ULTRARARE': '#FF5BAD',
      'SECRETRARE': '#FFD700'
    };
    
    return rarityMap[rarity] || '#FF8F3F';
  };

  // Afficher une carte à partir de l'URL de l'image
  const getImageUrl = (card) => {
    if (!card) return 'https://via.placeholder.com/245x342?text=Pokemon+Card&bg=transparent';
    
    if (card.image_url) {
      return card.image_url;
    }
    
    if (card.set_id && card.number) {
      return `https://images.pokemontcg.io/${card.set_id}/${card.number}_hires.png`;
    }
    
    return 'https://via.placeholder.com/245x342?text=Pokemon+Card&bg=transparent';
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Date inconnue";
    }
  };

  // Traduction de la rareté
  const translateRarity = (rarity) => {
    if (!rarity) return 'Rareté inconnue';
    
    const rarityTranslations = {
      'COMMON': 'Commune',
      'UNCOMMON': 'Peu Commune',
      'RARE': 'Rare',
      'HOLORARE': 'Holo Rare',
      'ULTRARARE': 'Ultra Rare',
      'SECRETRARE': 'Secret Rare'
    };
    
    return rarityTranslations[rarity] || rarity;
  };

  // Si pas de carte, afficher un message
  if (!card) {
    return (
      <div className="cards-page">
        <div className="card-detail-container">
          <div className="error-message">Aucune carte à afficher</div>
          <button className="back-button" onClick={onBack}>Retour à ma collection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-detail-wrapper">
      <div className="card-detail-container">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span> Retour à ma collection
        </button>
        
        <h1 className="card-detail-title">{card.name || 'Carte Pokémon'}</h1>
        
        <div className="card-detail-content">
          {/* Section de l'image avec effet 3D */}
          <div className="card-image-container">
            {card.image_url ? (
              <tcg-card 
                src={getImageUrl(card)} 
                alt={card.name || 'Carte Pokémon'}
              ></tcg-card>
            ) : (
              <div className="card-image-wrapper">
                <img 
                  src={getImageUrl(card)} 
                  alt={card.name || 'Carte Pokémon'}
                  className="card-detail-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/245x342?text=Pokemon+Card&bg=transparent';
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Section des informations */}
          <div className="card-info-container">
            {/* Graphique de l'évolution des prix */}
            <div className="price-history-card">
              <h2 className="section-title">
                Prix évolution (30j)
              </h2>
              
              {priceHistory.length > 0 ? (
                <div className="price-chart-container">
                  <div className="price-chart">
                    {/* Ligne de tendance uniquement - sans les points qui créent les traits verticaux */}
                    <svg className="price-line">
                      <polyline 
                        points={priceHistory.map((point, index) => {
                          const maxPrice = Math.max(...priceHistory.map(d => parseFloat(d.price)));
                          const minPrice = Math.min(...priceHistory.map(d => parseFloat(d.price)));
                          const range = maxPrice - minPrice || 1;
                          
                          const x = (index / (priceHistory.length - 1)) * 100;
                          const y = 100 - ((parseFloat(point.price) - minPrice) / range) * 80;
                          
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    </svg>
                  </div>
                  
                  {/* Étiquettes des dates */}
                  <div className="price-chart-labels">
                    <span>{priceHistory[0].date}</span>
                    <span>{priceHistory[Math.floor(priceHistory.length / 2)].date}</span>
                    <span>{priceHistory[priceHistory.length - 1].date}</span>
                  </div>
                  
                  {/* Plage de prix */}
                  <div className="price-range">
                    <span>${Math.max(...priceHistory.map(d => parseFloat(d.price))).toFixed(2)}</span>
                    <span>${Math.min(...priceHistory.map(d => parseFloat(d.price))).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <p className="no-data-message">Aucun historique de prix disponible</p>
              )}
            </div>
            
            {/* Grille des statistiques */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3 className="stat-title">SET</h3>
                <p className="stat-value">{card.set_name || card.set || 'Set inconnu'}</p>
              </div>
              
              <div className="stat-card">
                <h3 className="stat-title">RARETÉ</h3>
                <p className="stat-value" style={{ color: getRarityColor(card.rarity) }}>
                  {translateRarity(card.rarity)}
                </p>
              </div>
              
              <div className="stat-card">
                <h3 className="stat-title">NUMÉRO</h3>
                <p className="stat-value">{card.number || 'N/A'}</p>
              </div>
              
              <div className="stat-card">
                <h3 className="stat-title">PRIX ACTUEL</h3>
                <p className="stat-value price-value">
                  {card.price 
                    ? `${card.price.amount} ${card.price.currency}`
                    : 'Prix non disponible'}
                </p>
              </div>
              
              <div className="stat-card">
                <h3 className="stat-title">DATE DE SORTIE</h3>
                <p className="stat-value">{formatDate(card.release_date)}</p>
              </div>

              {/* Description si disponible */}
              {card.description && (
                <div className="stat-card description-card">
                  <h3 className="stat-title">DESCRIPTION</h3>
                  <p className="stat-value description-text">{card.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailComponent;