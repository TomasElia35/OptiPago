import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import OptimizerPage from './pages/OptimizerPage';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: 'var(--surface-color)', display: 'flex', justifyContent: 'center', gap: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Optimizador</Link>
        <Link to="/admin" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>Backoffice (IA)</Link>
      </nav>
      <Routes>
        <Route path="/" element={<OptimizerPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
