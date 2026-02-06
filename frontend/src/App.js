import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom"
import Home from './components/Home';
import Transcript from './components/Transcript';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className="App bg-brand-cream min-h-screen">
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/:selectedShow/episode/:episodeId" Component={Transcript} />
      </Routes>
      <Analytics />
    </div>
  );
}

export default App;
