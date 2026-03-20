import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-textMain font-sans select-none overflow-hidden">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/graph" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
