import React, { useState } from "react";  // Ajoutez l'import de useState
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from './components/Navbar';
import PokemonCollection from './components/PokemonCollection';
import Cards from './pages/Cards';
import CardDetail from "./components/CardDetail" 

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function App() {
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
        {/* Nouvelle route pour les détails de carte */}
        <Route
          path="/cards/:id"
          element={
            <ProtectedRoute>
              <CardDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App