import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App";
import Signup from "./signup";

import Dashboard from "./dashboard";
import MyFields from "./myfields";
import History from "./history";

import AdDashboard from "./ad/addashboard";
import AdFields from "./ad/adfields";
import AdAgents from "./ad/adagents";
import AdUpdates from "./ad/adupdates";
import AdReport from "./ad/adreport";

createRoot(document.getElementById("root")!).render(
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
);