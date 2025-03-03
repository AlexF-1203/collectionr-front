import React, { useState, useEffect } from 'react';
import '../styles/CardDetail.css';
import TCGCard from './TCGCard';

const CardDetailComponent = ({ card, onBack = () => {} }) => {
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    if (!card || !card.prices || !card.prices[0]?.daily_price) return;

    const generatePriceHistoryData = () => {
      const dailyPrices = card.prices[0].daily_price;
      const data = [];

      // Parcourir les 30 jours dans l'ordre inverse (du plus ancien au plus récent)
      for (let i = 30; i >= 1; i--) {
        const price = dailyPrices[`day_${i}`];
        if (price !== undefined) {
          data.push({
            day: i,
            price: parseFloat(price).toFixed(2)
          });
        }
      }

      setPriceHistory(data);
    };

    generatePriceHistoryData();
  }, [card]);
  
  // Effet séparé pour gérer les tooltips
  useEffect(() => {
    // Ajouter l'interaction pour les tooltips
    const setupTooltip = () => {
      const hoverPoints = document.querySelectorAll('.data-point-hover');
      const tooltip = document.querySelector('.price-tooltip');
      
      if (!hoverPoints.length || !tooltip) return;
      
      // Stocker les fonctions de gestionnaires d'événements pour le nettoyage
      const enterHandlers = [];
      const leaveHandlers = [];
      
      hoverPoints.forEach((point, index) => {
        const handleMouseEnter = (e) => {
          const price = e.target.getAttribute('data-price');
          const day = e.target.getAttribute('data-day');
          
          const tooltipDay = tooltip.querySelector('.tooltip-day span');
          const tooltipPrice = tooltip.querySelector('.tooltip-price span');
          
          tooltipDay.textContent = day;
          tooltipPrice.textContent = price;
          
          const rect = e.target.getBoundingClientRect();
          const chartRect = document.querySelector('.price-chart')?.getBoundingClientRect() || rect;
          
          tooltip.style.opacity = '1';
          tooltip.style.visibility = 'visible';
          
          // Positionner le tooltip par rapport au point
          const pointX = rect.left + rect.width/2 - chartRect.left;
          const pointY = rect.top - chartRect.top;
          
          tooltip.style.left = `${pointX}px`;
          tooltip.style.top = `${pointY - 40}px`;
        };
        
        const handleMouseLeave = () => {
          tooltip.style.opacity = '0';
          tooltip.style.visibility = 'hidden';
        };
        
        // Stocker les références aux fonctions
        enterHandlers[index] = handleMouseEnter;
        leaveHandlers[index] = handleMouseLeave;
        
        // Ajouter les écouteurs d'événements
        point.addEventListener('mouseenter', handleMouseEnter);
        point.addEventListener('mouseleave', handleMouseLeave);
      });
      
      // Retourner une fonction de nettoyage qui supprime exactement les mêmes gestionnaires
      return () => {
        hoverPoints.forEach((point, index) => {
          if (enterHandlers[index]) {
            point.removeEventListener('mouseenter', enterHandlers[index]);
          }
          if (leaveHandlers[index]) {
            point.removeEventListener('mouseleave', leaveHandlers[index]);
          }
        });
      };
    };
    
    // Exécuter après le rendu du composant
    let cleanupFunction;
    if (priceHistory.length > 0) {
      // Utiliser un délai pour s'assurer que le DOM est bien rendu
      const timeoutId = setTimeout(() => {
        cleanupFunction = setupTooltip();
      }, 100);
      
      // Nettoyer le timeout si le composant est démonté avant son exécution
      return () => {
        clearTimeout(timeoutId);
        if (cleanupFunction) cleanupFunction();
      };
    }
  }, [priceHistory]);

  const getImageUrl = (card) => {
    if (!card) return '';

    if (card.image_url && card.image_url !== 'null') {
      return card.image_url;
    }

    if (card.set_id && card.number) {
      return `https://images.pokemontcg.io/${card.set_id}/${card.number}_hires.png`;
    }

    return '';
  };
  
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
        <button className="back-button" onClick={() => onBack()}>
          <span className="back-icon">←</span> Retour à ma collection
        </button>

        <h1 className="card-detail-title">{card.name || 'Carte Pokémon'}</h1>

        <div className="card-detail-content">
          <div className="card-image-container">
            <TCGCard src={getImageUrl(card)} alt={card.name || 'Carte Pokémon'} />
          </div>

          <div className="card-info-container">
            <div className="price-history-card">
              <h2 className="section-title">
                Prix évolution (30j)
              </h2>

              {priceHistory.length > 0 ? (
                <div className="price-chart-container">
                  <div className="price-chart">
                    {/* Grille de fond */}
                    <div className="price-chart-grid">
                      <div className="grid-line horizontal"></div>
                      <div className="grid-line horizontal"></div>
                      <div className="grid-line horizontal"></div>
                      <div className="grid-line vertical"></div>
                      <div className="grid-line vertical"></div>
                      <div className="grid-line vertical"></div>
                    </div>
                    
                    {/* SVG pour la courbe */}
                    <svg className="price-line" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FF8F3F" />
                          <stop offset="100%" stopColor="#F8B622" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      
                      {/* Ligne du graphique */}
                      <polyline
                        points={priceHistory.map((point, index) => {
                          const maxPrice = Math.max(...priceHistory.map(d => parseFloat(d.price)));
                          const minPrice = Math.min(...priceHistory.map(d => parseFloat(d.price)));
                          const range = maxPrice - minPrice || 1;

                          // Calculer la position X basée sur le jour (30 à 1)
                          const x = ((30 - point.day) / 29) * 100;
                          const y = 100 - ((parseFloat(point.price) - minPrice) / range) * 80;

                          return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                      />
                      
                      {/* Points aux jours 1, 7 et 30 */}
                      {priceHistory.map((point) => {
                        if (point.day === 1 || point.day === 7 || point.day === 30) {
                          const maxPrice = Math.max(...priceHistory.map(d => parseFloat(d.price)));
                          const minPrice = Math.min(...priceHistory.map(d => parseFloat(d.price)));
                          const range = maxPrice - minPrice || 1;

                          const x = ((30 - point.day) / 29) * 100;
                          const y = 100 - ((parseFloat(point.price) - minPrice) / range) * 80;

                          return (
                            <g key={`point-${point.day}`} className="data-point-group">
                              <circle
                                cx={x}
                                cy={y}
                                r="2"
                                className="data-point"
                                fill="#FFF"
                                stroke="url(#lineGradient)"
                                strokeWidth="1"
                              />
                              <circle
                                cx={x}
                                cy={y}
                                r="4"
                                className="data-point-hover"
                                fill="transparent"
                                data-price={`$${parseFloat(point.price).toFixed(2)}`}
                                data-day={`Jour ${point.day}`}
                              />
                            </g>
                          );
                        }
                        return null;
                      })}
                    </svg>
                    
                    {/* Tooltip */}
                    <div className="price-tooltip">
                      <div className="tooltip-content">
                        <div className="tooltip-day"><span></span></div>
                        <div className="tooltip-price">Prix: <span></span></div>
                      </div>
                    </div>
                  </div>

                  <div className="price-chart-labels">
                    <span>Jour 30</span>
                    <span>Jour 15</span>
                    <span>Jour 1</span>
                  </div>

                  <div className="price-range">
                    <span>${Math.max(...priceHistory.map(d => parseFloat(d.price))).toFixed(2)}</span>
                    <span>${(Math.max(...priceHistory.map(d => parseFloat(d.price))) + Math.min(...priceHistory.map(d => parseFloat(d.price)))) / 2 .toFixed(2)}</span>
                    <span>${Math.min(...priceHistory.map(d => parseFloat(d.price))).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <p className="no-data-message">Aucun historique de prix disponible</p>
              )}
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3 className="stat-title">SET</h3>
                <p className="stat-value">{card.set_name || card.set || 'Set inconnu'}</p>
              </div>

              <div className="stat-card">
                <h3 className="stat-title">RARETÉ</h3>
                <p className="stat-value">{card.rarity || 'Rareté inconnue'}</p>
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
                <p className="stat-value">{card.release_date || 'Date inconnue'}</p>
              </div>

              {card.description && (
                <div className="stat-card">
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