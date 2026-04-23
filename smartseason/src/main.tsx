import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import Signup from './signup.tsx'
import Dashboard from './dashboard.tsx'
import Agents from './agent.tsx'
import Updates from './updates.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agent" element={<Agents />} />
        <Route path="/update" element={<Updates />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
