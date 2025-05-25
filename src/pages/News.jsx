// import React from "react";
import '../styles/News.css';

const News = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Actualités</h1>

    <div className="news-section">
  <div className="news-grid">
    <div className="news-principal">
      <img src="/assets/image1.jpg" alt="" />
      <div className="news-content">
        <span className="news-tag">Actualités</span>
        <h2 className="news-title">IA : Plus qu’une tendance...</h2>
        <p className="news-description">
          L’IA n’est plus une simple innovation...
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
