import { useEffect, useState } from 'react';
import '../styles/Settings.css'; // ou styled-components / Tailwind / autre
import api from '../api';

const Settings = ({ isOpen, onClose, user, setUser }) => {
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const response = await api.patch('/api/user/update/', formData);
      setUser(response.data); // met à jour App
      setStatusMsg("Profil mis à jour !");
      onClose(); // ferme le panneau
    } catch (err) {
      setStatusMsg("Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  if (!user) return null;

  const isModified = formData.username !== user?.username || formData.email !== user?.email;

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{user?.username || "Chargement..."}</h2>
        <form onSubmit={handleSubmit}>
  <label>Nom d'utilisateur</label>
  <input
    type="text"
    name="username"
    value={formData.username}
    onChange={(e) =>
      setFormData({ ...formData, username: e.target.value })
    }
  />

  <label>Email</label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={(e) =>
      setFormData({ ...formData, email: e.target.value })
    }
  />

<button type="submit" disabled={!isModified || loading}>
  {loading ? "Enregistrement..." : "Enregistrer"}
</button>
</form>

      </div>
    </div>
  );
};

export default Settings;
