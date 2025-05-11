import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from './components/Navbar';
import PokemonCollection from './components/PokemonCollection';
import Cards from './pages/Cards';
import CardDetail from "./pages/CardDetail";
import Profile from './pages/Profile';
import AuthCallback from './components/AuthCallback';
import Settings from './components/Settings'; // n'oublie pas cette ligne
import './components/TCGCard';
import './styles/TCGCard.css';
import { ACCESS_TOKEN } from './constants';
import api from "./api";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState(null);
  const [isSettingsOpen, setSettingsOpen] = useState(false); // 👈 Ajout ici

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get('/api/user/profile/');
        setUser(data);
      } catch (err) {
        localStorage.removeItem(ACCESS_TOKEN);
      }
    };

    fetchUserData();
  }, []);

  return (
    <BrowserRouter>
      <Navbar onOpenSettings={() => setSettingsOpen(true)} />
      <Settings isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} user={user} setUser={setUser} />

      <button onClick={() => setSettingsOpen(true)}>Ouvrir paramètres</button>

      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login route="/api/token/" method="login" />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register route="api/user/register/" method="register" />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/collection" element={<ProtectedRoute><PokemonCollection /></ProtectedRoute>} />
        <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
        <Route path="/cards/:id" element={<ProtectedRoute><CardDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
