const Sidebar = ({ user, uploadingImage, onAvatarClick, onImageUpload, fileInputRef, profileData }) => (
  <div className="profile-sidebar">
    <div className="user-avatar" onClick={onAvatarClick}>
      <img
        src={user.profilePicture?.startsWith('http') ? user.profilePicture : `${import.meta.env.VITE_API_URL}${user.profilePicture}`}
        alt="Avatar"
      />
      <div className="avatar-overlay">
        {uploadingImage ? <div className="upload-spinner">⏳</div> : <div className="camera-icon">📷</div>}
      </div>
    </div>
    <input type="file" ref={fileInputRef} onChange={onImageUpload} accept="image/*" style={{ display: 'none' }} />
    <div className="user-info">
      <div className="user-handle">@{user.username}</div>
      <div className="user-email">{user.email}</div>
    </div>
    <div className="user-stats">
      <div className="stat"><div className="stat-value">{profileData.totalCards}</div><div className="stat-label">Cartes</div></div>
      <div className="stat"><div className="stat-value">{profileData.cardsBySets}</div><div className="stat-label">Sets</div></div>
      <div className="stat"><div className="stat-value">{profileData.collectionValue.toFixed(2)} €</div><div className="stat-label">Valeur</div></div>
    </div>
  </div>
);

export default Sidebar;
