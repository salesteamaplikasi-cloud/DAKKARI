import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import DataTarik from './pages/DataTarik';
import './index.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('dakkari_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('dakkari_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dakkari_auth');
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Memuat...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
        />
        
        <Route 
          path="/" 
          element={isAuthenticated ? <DashboardLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        >
          <Route index element={<DashboardHome />} />
          <Route path="data" element={<DataTarik />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
