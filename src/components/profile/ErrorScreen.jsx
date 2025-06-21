const ErrorScreen = ({ error }) => (
  <div className="error-container">
    <div className="error-message">
      <h2>Erreur</h2>
      <p>{error}</p>
      <button className="retry-button" onClick={() => window.location.reload()}>Réessayer</button>
    </div>
  </div>
);

export default ErrorScreen;
