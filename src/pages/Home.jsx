import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/Button.css';

const Home = () => {
  const words = ['Trade', 'Discover', 'Share'];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Collection</span>
            <span className="typing-text">{words[wordIndex]}</span>
          </h1>
          <p className="hero-subtitle"><span className="mot-appuyer">Maximisez</span> la valeur de votre collection pour suivre et échanger vos cartes en toute simplicité avec <span className="mot-appuyer">CollectionR</span></p>
          <div className="cta-buttons">
            <Link to="/signup" className="primary-btn">Start the adventure</Link>
            <Link to="/cards" className="secondary-btn">Discover cards</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-cards">
            <img src="https://images.pokemontcg.io/sv8pt5/161_hires.png" alt="Charizard VMAX" className="card-1 animated-card" />
            <img src="https://images.pokemontcg.io/swsh45sv/SV122_hires.png" alt="Blastoise EX Full Art" className="card-2 animated-card" />
            <img src="https://images.pokemontcg.io/swsh12pt5/160_hires.png" alt="Charizard Base Set" className="card-3 animated-card" />
            <img src="https://images.pokemontcg.io/swsh45sv/SV107_hires.png" alt="Pikachu VMAX Rainbow Rare" className="card-4 animated-card" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Pourquoi nous choisir ?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-chart-line feature-icon"></i>
            <h3>Suivi en temps réel</h3>
            <p>Surveillez la valeur de votre collection et les tendances du marché</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-shield-alt feature-icon"></i>
            <h3>Échange sécurisé</h3>
            <p>Système d'échange sécurisé avec garantie de satisfaction</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-users feature-icon"></i>
            <h3>Communauté active</h3>
            <p>Rejoignez une communauté passionnée de collectionneurs</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-qrcode feature-icon"></i>
            <h3>Scan intelligent</h3>
            <p>Scannez vos cartes pour les ajouter instantanément</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Prêt à commencer ta collection ?</h2>
          <p>Rejoignez-nous aujourd'hui et commencez à collectionner</p>
          <Link to="/signup" className="primary-btn">Créer un compte</Link>
        </div>
        <div className="cta-background"></div>
      </section>
    </div>
  );
};

export default Home;
