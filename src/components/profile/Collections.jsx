const Collections = ({ sets, onSelect, onClear, selectedSet, searchTerm, onSearchChange, dropdownOpen, toggleDropdown, currentPage, totalPages, onPageChange }) => (
  <div className="content-section">
    <h3>Sets Pokémon</h3>
    <div className="search-and-pagination">
      <div className="dropdown-container">
        <button className="dropdown-button" onClick={toggleDropdown}>
          {selectedSet ? selectedSet.title : 'Sélectionner un set'} {dropdownOpen ? '▲' : '▼'}
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-search">
              <input type="text" placeholder="Filtrer les sets..." value={searchTerm} onChange={onSearchChange} onClick={e => e.stopPropagation()} />
            </div>
            <div className="dropdown-items">
              {sets.map((set, i) => (
                <div key={set.id || i} className="dropdown-item" onClick={() => onSelect(set)}>{set.title}</div>
              ))}
            </div>
            {selectedSet && (
              <div className="dropdown-footer">
                <button className="clear-selection" onClick={e => { e.stopPropagation(); onClear(); }}>Effacer la sélection</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    <div className="collections-grid">
      {sets.length > 0 ? sets.map((set, index) => (
        <div className="card-preview" key={set.id || index}>
          <div className="set-image-container">
            <img
              src={set.imageUrl || set.image_url}
              alt={set.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/150x130?text=${set.title}`;
              }}
            />
          </div>
          <div className="card-info">
            <div className="card-header">
              <h4>{set.title}</h4>
              <span className="card-set">{set.releaseDate}</span>
            </div>
            <div className="card-collection">
              {set.ownedCards !== undefined && set.totalCards !== undefined ? (
                <>
                  <div className="collection-text">{set.ownedCards}/{set.totalCards} cartes • {set.progress}% complet</div>
                  <div className="progress-bar-wrapper">
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${set.progress}%` }} />
                    </div>
                  </div>
                </>
              ) : set.total_cards !== undefined ? (
                <>
                  <div className="collection-text">0/{set.total_cards} cartes • 0% complet</div>
                  <div className="progress-bar-wrapper">
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `0%` }} />
                    </div>
                  </div>
                </>
              ) : <div>Collection en cours</div>}
            </div>
          </div>
        </div>
      )) : (
        <div className="empty-state"><i>🃏</i><p>Aucun set Pokémon</p></div>
      )}
    </div>
    {totalPages > 1 && (
      <div className="pagination">
        <button className="pagination-button" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>&laquo; Précédent</button>
        <div className="page-info">Page {currentPage} sur {totalPages}</div>
        <button className="pagination-button" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Suivant &raquo;</button>
      </div>
    )}
  </div>
);

export default Collections;
