import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom"
import Home from './components/Home';
import Transcript from './components/Transcript';

function App() {
  return (
    <div className="App" style={{ backgroundColor: "#F6F1E9" }}>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/:selectedShow/episode/:episodeId" Component={Transcript} />
      </Routes>
    </div>
  );
}

export default App;
