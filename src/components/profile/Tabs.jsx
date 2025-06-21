const Tabs = ({ activeTab, onChange }) => (
  <div className="content-tabs">
    <button className={`tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => onChange('activity')}>Activité</button>
    <button className={`tab ${activeTab === 'collections' ? 'active' : ''}`} onClick={() => onChange('collections')}>Sets</button>
    <button className={`tab ${activeTab === 'favoris' ? 'active' : ''}`} onClick={() => onChange('favoris')}>Favoris</button>
  </div>
);

export default Tabs;
