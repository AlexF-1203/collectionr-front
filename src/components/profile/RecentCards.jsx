const RecentCards = ({ cards }) => (
  <div className="content-section">
    <h3>Activité récente</h3>
    {cards.length > 0 ? cards.map(card => {
      const price = card.price ? `${Number(card.price).toFixed(2)} €` : 'N/A';
      const hasPrices = card.prices?.length > 0 && card.prices[0].daily_price;
      const daily = hasPrices ? card.prices[0].daily_price : null;
      const diff = daily ? Number(daily.day_2 - daily.day_1).toFixed(2) : null;
      const isPositive = daily && diff >= 0;

      return (
        <div className="card-preview" key={card.id}>
          <img src={card.image} alt={card.name} />
          <div className="card-info">
            <div className="card-header">
              <h4>{card.name}</h4>
              <span className="card-set">{card.set.title}</span>
            </div>
          </div>
          <div className="card-price-info">
            <div className="price-value">{price}</div>
            <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>{daily ? `${isPositive ? '+' : ''}${diff} €` : 'N/A'}</div>
          </div>
        </div>
      );
    }) : (
      <div className="empty-state"><i>📋</i><p>Aucune activité récente</p></div>
    )}
  </div>
);

export default RecentCards;
