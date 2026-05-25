import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tournaments from './pages/Tournaments';
import Leaderboard from './pages/Leaderboard';
import EsportsTV from './pages/EsportsTV';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary">Establishing secure connection...</div>;
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-textMain selection:bg-primary/30">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/esportstv" element={<EsportsTV />} />
          <Route path="/esports-tv" element={<EsportsTV />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-white/10 bg-surface/50 py-8 text-center text-textMuted text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-display font-bold tracking-widest uppercase">AETMS Network © 2026</p>
          <p className="text-xs uppercase tracking-widest opacity-50">System Status: Online</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Use localhost:8000 for dev, adjust for prod
    const wsUrl = `${protocol}//localhost:8000/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_TOURNAMENT') {
          toast.success(data.message, { icon: '🏆', duration: 5000 });
        } else if (data.type === 'SUPER_CHAT') {
          toast.success(
            <div className="flex flex-col">
              <span className="font-bold text-yellow-400 text-sm">SUPERCHAT • ₹{data.amount}</span>
              <span className="font-semibold text-white">{data.user}: {data.content}</span>
            </div>, 
            { 
              icon: '⭐', 
              duration: 8000,
              style: {
                background: '#1a1a1a',
                border: '1px solid #eab308',
                color: '#fff',
                boxShadow: '0 0 15px rgba(234, 179, 8, 0.3)'
              }
            }
          );
        }
      } catch (err) {
        console.error("WS parse error", err);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
