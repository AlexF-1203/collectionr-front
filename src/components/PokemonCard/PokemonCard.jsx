import { useRef, useEffect } from 'react';
import './styles.css';

const PokemonCard = ({ card }) => {
  const cardRef = useRef(null);

  const normalizeRarity = (rarity) => {
    if (!rarity) return '';
    return rarity.toLowerCase()
      .replace('vmax', 'holo vmax')
      .replace('vstar', 'holo vstar')
      .replace('v ', 'holo v ');
  };

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--rx', '0');
      cardRef.current.style.setProperty('--ry', '0');
      cardRef.current.style.setProperty('--mx', '50%');
      cardRef.current.style.setProperty('--my', '50%');
      cardRef.current.style.setProperty('--hyp', '0');
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();

    const fromLeft = (e.clientX - left) / width;
    const fromTop = (e.clientY - top) / height;
    const fromCenter = Math.sqrt(Math.pow(fromLeft - 0.5, 2) + Math.pow(fromTop - 0.5, 2));

    requestAnimationFrame(() => {
      cardRef.current.style.setProperty('--pointer-x', `${fromLeft * 100}%`);
      cardRef.current.style.setProperty('--pointer-y', `${fromTop * 100}%`);
      cardRef.current.style.setProperty('--pointer-from-left', String(fromLeft));
      cardRef.current.style.setProperty('--pointer-from-top', String(fromTop));
      cardRef.current.style.setProperty('--pointer-from-center', String(fromCenter));

      const rotateX = (fromTop - 0.5) * -10;
      const rotateY = (fromLeft - 0.5) * 10;
      const rotateZ = (fromLeft - 0.5) * 2;

      cardRef.current.style.setProperty('--card-rotate-x', `${rotateX}deg`);
      cardRef.current.style.setProperty('--card-rotate-y', `${rotateY}deg`);
      cardRef.current.style.setProperty('--card-rotate-z', `${rotateZ}deg`);
      cardRef.current.style.setProperty('--card-opacity', String(0.3 + fromCenter * 0.2));
    });
  };

  const handleTouchMove = (e) => {
    if (!cardRef.current) return;
    const touch = e.touches[0];
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();

    const mx = ((touch.clientX - left) / width) * 2 - 1;
    const my = ((touch.clientY - top) / height) * 2 - 1;

    requestAnimationFrame(() => {
      cardRef.current.style.setProperty('--rx', String(my * 15));
      cardRef.current.style.setProperty('--ry', String(mx * -15));
      cardRef.current.style.setProperty('--mx', `${(mx + 1) * 50}%`);
      cardRef.current.style.setProperty('--my', `${(my + 1) * 50}%`);
      cardRef.current.style.setProperty('--hyp', String(Math.sqrt(Math.pow(mx, 2) + Math.pow(my, 2))));
    });
  };

  return (
    <div
      ref={cardRef}
      className="card"
      data-rarity={normalizeRarity(card.rarity)}
      data-gallery={card.gallery ? "true" : "false"}
      data-subtypes={card.subtypes ? card.subtypes.join(' ').toLowerCase() : ''}
      data-supertype={card.supertype ? card.supertype.toLowerCase() : ''}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={(e) => e.currentTarget.classList.add('interacting')}
      onTouchStart={(e) => e.currentTarget.classList.add('interacting')}
      onMouseLeave={(e) => {
        e.currentTarget.classList.remove('interacting');
        e.currentTarget.style.setProperty('--rx', '0');
        e.currentTarget.style.setProperty('--ry', '0');
        e.currentTarget.style.setProperty('--mx', '50%');
        e.currentTarget.style.setProperty('--my', '50%');
        e.currentTarget.style.setProperty('--hyp', '0');
      }}
      onTouchEnd={(e) => {
        e.currentTarget.classList.remove('interacting');
        e.currentTarget.style.setProperty('--rx', '0');
        e.currentTarget.style.setProperty('--ry', '0');
        e.currentTarget.style.setProperty('--mx', '50%');
        e.currentTarget.style.setProperty('--my', '50%');
        e.currentTarget.style.setProperty('--hyp', '0');
      }}
    >
      <div className="card__translater">
        <div className="card__rotator">
          <div className="card__front">
            <img
              className="card__image"
              src={card.images.large}
              alt={card.name}
              loading="lazy"
            />
            <div className="card__shine"></div>
            <div className="card__glare"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
