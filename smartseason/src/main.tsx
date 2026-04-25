import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

import App from './App.tsx'
import Signup from './signup.tsx'


import Dashboard from './dashboard.tsx'
import MyFields from './myfields.tsx'
import History from './history.tsx'


import AdDashboard from './ad/addashboard.tsx'
import AdFields from './ad/adfields.tsx'
import AdAgents from './ad/adagents.tsx'
import AdUpdates from './ad/adupdates.tsx'
import AdReport from './ad/adreport.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myfields" element={<MyFields />} />
        <Route path="/history" element={<History />} />

        <Route path="/addashboard" element={<AdDashboard />} />
        <Route path="/adfields" element={<AdFields />} />
        <Route path="/adagents" element={<AdAgents />} />
        <Route path="/adupdates" element={<AdUpdates />} />
        <Route path="/adreport" element={<AdReport />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
)