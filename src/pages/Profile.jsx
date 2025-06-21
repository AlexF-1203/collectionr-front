import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../api';
import '../styles/Profile.css';

import {
        Sidebar,
        Tabs,
        Loader,
        ErrorScreen,
        RecentCards,
        FavoriteCards,
        Collections
       } from '@/components/profile';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({ totalCards: 0, cardsBySets: 0, favoriteCards: [], recentCards: [], sets: [], collectionValue: 0, collectionProgress: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedView, setExpandedView] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const setsPerPage = 4;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await api.get('/api/user/profile/');
        setUser(userRes.data);
        const profileRes = await api.get('/api/user/profile/data/');
        const data = profileRes.data;

        setProfileData({
          totalCards: data.totalCards || 0,
          cardsBySets: data.cardsBySets || 0,
          favoriteCards: data.favoriteCards?.filter(card => card.tcg === 'pokemon') || [],
          recentCards: data.recentCards?.filter(card => card.tcg === 'pokemon') || [],
          sets: data.sets || data.collections?.pokemon || [],
          collectionValue: data.collectionValue || 0,
          collectionProgress: data.collectionProgress || 0
        });
      } catch (err) {
        setError("Erreur lors du chargement du profil");
        if (err.response?.status === 401) {
          setError("Session expirée. Redirection...");
          setTimeout(() => (window.location.href = '/login'), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      const res = await api.patch('/api/user/update/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(prev => ({ ...prev, profilePicture: res.data.profile_picture }));
    } catch {
      alert("Erreur lors de l'upload de la photo.");
    } finally {
      setUploadingImage(false);
      fileInputRef.current.value = '';
    }
  };

  const filteredSets = useMemo(() => selectedSet ? [selectedSet] : profileData.sets.filter(set => set.title.toLowerCase().includes(searchTerm.toLowerCase())), [profileData.sets, searchTerm, selectedSet]);
  const currentSets = useMemo(() => expandedView ? filteredSets : filteredSets.slice((currentPage - 1) * setsPerPage, currentPage * setsPerPage), [filteredSets, currentPage, expandedView]);
  const totalPages = Math.ceil(filteredSets.length / setsPerPage);

  const handleRemoveFavorite = async (cardId) => {
    try {
      const res = await api.get('/api/favorites/');
      const fav = res.data.find(f => f.card.id === cardId);
      if (fav) {
        await api.delete(`/api/favorites/${fav.id}/`);
        setProfileData(prev => ({ ...prev, favoriteCards: prev.favoriteCards.filter(card => card.id !== cardId) }));
      }
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorScreen error={error} />;
  if (!user) return <ErrorScreen error="Utilisateur non connecté." />;

  return (
    <div className="unique-container">
      <div className="profile-container">
        <Sidebar
          user={user}
          uploadingImage={uploadingImage}
          onAvatarClick={() => fileInputRef.current?.click()}
          onImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          profileData={profileData}
        />

        <div className="profile-main">
          <Tabs activeTab={activeTab} onChange={(tab) => { setActiveTab(tab); setCurrentPage(1); setSearchTerm(''); setExpandedView(false); setSelectedSet(null); setIsDropdownOpen(false); }} />
          <div className="tab-content">
            {activeTab === 'activity' && <RecentCards cards={profileData.recentCards} />}
            {activeTab === 'favoris' && <FavoriteCards cards={profileData.favoriteCards} onRemove={handleRemoveFavorite} />}
            {activeTab === 'collections' && (
              <Collections
                sets={currentSets}
                selectedSet={selectedSet}
                dropdownOpen={isDropdownOpen}
                onSelect={setSelectedSet}
                onClear={() => { setSelectedSet(null); setSearchTerm(''); }}
                searchTerm={searchTerm}
                onSearchChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
