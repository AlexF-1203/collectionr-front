import { useEffect, useState } from "react";
import '../styles/News.css';
import api from "../api";

const News = () => {
  const [error, setError] = useState(null);
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const res = await api.get('/api/news/');
      return Array.isArray(res.data) ? res.data : res.data.results || [];
    } catch(err) {
      console.error("Erreur lors du chargement des actualités :", err);
      setError("Impossible de charger les actualités.");
      return [];
    }
  };

  useEffect(() => {
  const loadData = async () => {
    const data = await fetchBlog();
    setBlog(data);
    setLoading(false);
  };
  loadData();
}, []);

  const truncateWords = (text, wordLimit) => {
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
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

  return (
    <div className="page-container">
      <h1 className="page-title">Actualités</h1>

    <div className="news-section">
  <div className="news-grid">
    <div className="news-principal">
      <img src="/assets/image1.jpg" alt="" />
      <div className="news-content">
        <span className="news-tag">Actualités</span>
        <h2 className="news-title">{blog[0].title}</h2>
        <p className="news-description">
          {truncateWords(blog[0].content, 7)}
        </p>
      </div>
    </div>

    <div className="news-right">
      <div className="news-secondary">
        <img src="/assets/image2.jpg" alt="" />
        <div className="news-content">
          <span className="news-tag">Cloud</span>
          <h3 className="news-title">Vos données doivent vivre dans le cloud !</h3>
        </div>
      </div>

      <div className="news-secondary">
        <img src="/assets/image2.jpg" alt="" />
        <div className="news-content">
          <span className="news-tag">Intelligence artificielle</span>
          <h3 className="news-title">L’IA : L’allié clé...</h3>
        </div>
      </div>

      <div className="news-secondary">
        <img src="/assets/image2.jpg" alt="" />
        <div className="news-content">
          <span className="news-tag">Intelligence artificielle</span>
          <h3 className="news-title">L’essentiel du Diag Data IA...</h3>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}

export default News;
