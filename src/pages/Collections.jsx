import '../styles/Collections.css';
import api from '../api';
import { useState, useEffect } from 'react';

const CollectionPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (loading) {
      const startTime = Date.now();
      interval = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const simulateProgress = () => {
    const steps = [
      { step: 'Chargement de l\'image...', progress: 20 },
      { step: 'Initialisation du modèle CLIP...', progress: 40 },
      { step: 'Extraction des features...', progress: 70 },
      { step: 'Recherche dans la base de données...', progress: 90 },
      { step: 'Finalisation...', progress: 100 }
    ];

    steps.forEach((stepData, index) => {
      setTimeout(() => {
        setCurrentStep(stepData.step);
        setProgress(stepData.progress);
      }, index * 800); // 0.8 seconde par étape
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setLoading(true);
      setProgress(0);
      setCurrentStep('Démarrage de l\'analyse...');

      // Démarrer la simulation de progress
      simulateProgress();

      const response = await api.post('/api/card-identification/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data)
      setResult(response.data);
      setCurrentStep('Analyse terminée !');
      setProgress(100);

    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue.');
      setCurrentStep('Erreur lors de l\'analyse');
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setCurrentStep('');
      }, 1000);
    }
  };

  return (
    <div className="page-container">
      <div className="cards-page">
        <h1 className="page-title">Identification de Carte</h1>

        <form onSubmit={handleSubmit} className="filters" encType="multipart/form-data">
          <div className="filter-group">
            <label htmlFor="imageUpload">Image :</label>
            <input
              type="file"
              id="imageUpload"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="filter-input"
            />
            {selectedFile && (
              <div className="file-preview">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="image-preview"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="pagination-button"
            disabled={!selectedFile || loading}
          >
            {loading ? 'Analyse en cours...' : 'Identifier'}
          </button>
        </form>

        {loading && (
          <div className="progress-container">
            <div className="timer">
              ⏱️ Temps écoulé: {elapsedTime.toFixed(1)}s
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">{progress}%</div>
            </div>

            <div className="current-step">
              🔍 {currentStep}
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className="cards-container">
            <div className="cards-grid">
              <div className="card-frame">
                <div className="card-item">
                  <img
                    src={result.card_info.image_url}
                    alt={result.card_info.name}
                    className="card-image"
                  />
                </div>
                <div className="card-info">
                  <h3 className="card-name">{result.card_info.name}</h3>
                  <p className="card-set">{result.card_info.set_name}</p>
                  <p className="card-rarity">{result.card_info.rarity}</p>
                  <p className="card-rarity">#{result.card_info.number}</p>
                  <p className="card-rarity">{result.card_info.price} €</p>
                  <p className="card-rarity">Score : {Math.min((result.similarity_score * 100), 100).toFixed(2)}%</p>

                  {result.performance && (
                    <div className="performance-info">
                      <h4>📊 Métriques :</h4>
                      <p>⚡ Total: {result.performance.total_time}s</p>
                      <p>🖼️ Image: {result.performance.image_load_time}s</p>
                      <p>🤖 Modèle: {result.performance.model_init_time}s</p>
                      <p>🔎 Analyse: {result.performance.identification_time}s</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
