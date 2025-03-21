import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from './components/Navbar';
import PokemonCollection from './components/PokemonCollection';
import Cards from './pages/Cards';
import CardDetail from "./pages/CardDetail"
import Profile from './pages/Profile';
import './components/TCGCard'; 
import './styles/TCGCard.css';
import { ACCESS_TOKEN } from './constants';

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer les informations de l'utilisateur au chargement
    const fetchUserData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        try {
          const response = await fetch('/api/user/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.error('Erreur de réponse:', response.status);
            localStorage.removeItem(ACCESS_TOKEN);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          localStorage.removeItem(ACCESS_TOKEN);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={<Login route="/api/token/" method="login" />}
        />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/register"
          element={<Register route="api/user/register/" method="register" />}
        />
        <Route
          path="/collection"
          element={
            <ProtectedRoute>
              <PokemonCollection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cards"
          element={
            <ProtectedRoute>
              <Cards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cards/:id"
          element={
            <ProtectedRoute>
              <CardDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App