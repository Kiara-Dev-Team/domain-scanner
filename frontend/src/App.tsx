import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { NewScan } from './pages/NewScan';
import { ScanResults } from './pages/ScanResults';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new-scan" element={<NewScan />} />
        <Route path="/scan/:id" element={<ScanResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
