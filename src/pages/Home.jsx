import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  // const [currentWord, setCurrentWord] = useState('');
  const words = ['Trade', 'Discover', 'Share'];
  const [wordIndex, setWordIndex] = useState(0);

  const [collectors, setCollectors] = useState(0);
  const [cardsTraded, setCardsTraded] = useState(0);
  const [collections, setCollections] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animateValue = (setter, end, duration) => {
      const start = 0;
      const increment = end / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);
    };

    animateValue(setCollectors, 20000, 2000);
    animateValue(setCardsTraded, 150000, 2000);
    animateValue(setCollections, 1500, 2000);
  }, []);

  const trendingCards = [
    {
      name: 'Charizard VMAX',
      set: 'Sword & Shield',
      image: 'https://i.ebayimg.com/images/g/s-8AAOSwNX1hfqA3/s-l1200.jpg',
      badge: { type: 'hot', text: 'Hot 🔥' },
      priceChange: { value: 12.5, positive: true },
      trades: 238
    },
    {
      name: 'Mew V',
      set: 'Scarlet & Violet',
      image: 'https://pokemoms.fr/wp-content/uploads/2022/12/113_264_mew_v_pokemoms.jpg',
      badge: { type: 'trending', text: 'Trending ⚡' },
      priceChange: { value: 8.3, positive: true },
      trades: 186
    },
    {
      name: 'Pikachu VMAX',
      set: 'Crown Zenith',
      image: 'https://assets.pokemon.com/static-assets/content-assets/cms2-fr-fr/img/cards/web/SWSH4/SWSH4_FR_188.png',
      badge: { type: 'new', text: 'New Release 🌟' },
      priceChange: { value: 3.2, positive: false },
      trades: 145
    },
    {
      name: 'Mewtwo V',
      set: 'Scarlet & Violet',
      image: 'https://static.pkmcards.fr/cards/fr/pgo/image-cartes-a-collectionner-pokemon-card-game-tcg-pkmcards-pgo-fr-030-epee-et-bouclier-pokemon-go-mewtwo-v.webp',
      badge: { type: 'hot', text: 'Hot 🔥' },
      priceChange: { value: 15.7, positive: true },
      trades: 212
    }
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Collect</span>
            <span className="typing-text">{words[wordIndex]}</span>
          </h1>
          <p className="hero-subtitle">Your next-generation Pokémon card collection platform</p>
          <div className="cta-buttons">
            <Link to="/signup" className="primary-btn">Start the adventure</Link>
            <Link to="/cards" className="secondary-btn">Discover cards</Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{collectors}</span>
              <span className="stat-label">Collectors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{cardsTraded}</span>
              <span className="stat-label">Cards traded</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{collections}</span>
              <span className="stat-label">Collections</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-cards">
            <img src="https://images.pokemontcg.io/base1/58.png" alt="Pokemon Card" className="card-1" />
            <img src="https://images.pokemontcg.io/neo1/17.png" alt="Pokemon Card" className="card-2" />
            <img src="https://images.pokemontcg.io/base1/58.png" alt="Pokemon Card" className="card-3" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why choose us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-chart-line feature-icon"></i>
            <h3>Real-time tracking</h3>
            <p>Monitor your collections value and market trends</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-shield-alt feature-icon"></i>
            <h3>Secure trading</h3>
            <p>Secure trading system with satisfaction guarantee</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-users feature-icon"></i>
            <h3>Active community</h3>
            <p>Join a passionate community of collectors</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-qrcode feature-icon"></i>
            <h3>Smart scanning</h3>
            <p>Scan your cards to add them instantly</p>
          </div>
        </div>
      </section>

      <section className="market-trends">
        <h2 className="section-title">Today's Hot Cards</h2>
        <div className="trends-container">
          {trendingCards.map((card, index) => (
            <div key={index} className="trend-card">
              <div className="card-image">
                <img src={card.image} alt={card.name} />
                <div className={`trend-badge ${card.badge.type}`}>{card.badge.text}</div>
              </div>
              <div className="trend-info">
                <h4>{card.name}</h4>
                <p className="card-set">{card.set}</p>
                <div className="trend-stats">
                  <span className={`price-change ${card.priceChange.positive ? 'positive' : 'negative'}`}>
                    <i className={`fas fa-arrow-${card.priceChange.positive ? 'up' : 'down'}`}></i>
                    {card.priceChange.value}%
                  </span>
                  <span className="trades-volume">{card.trades} trades today</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="community-section">
        <div className="community-content">
          <h2 className="section-title">Join the community</h2>
          <p className="community-description">
            Connect with thousands of collectors, participate in events,
            and stay informed about the latest releases.
          </p>
          <div className="community-grid">
            <div className="community-stat">
              <i className="fas fa-users"></i>
              <span className="stat-count">21K+</span>
              <span className="stat-label">Active members</span>
            </div>
            <div className="community-stat">
              <i className="fas fa-comments"></i>
              <span className="stat-count">42K+</span>
              <span className="stat-label">Discussions</span>
            </div>
            <div className="community-stat">
              <i className="fas fa-handshake"></i>
              <span className="stat-count">151K+</span>
              <span className="stat-label">Trades</span>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to start your collection?</h2>
          <p>Join us today and start collecting</p>
          <Link to="/signup" className="cta-button">Create an account</Link>
        </div>
        <div className="cta-background"></div>
      </section>
    </div>
  );
};

export default Home;
