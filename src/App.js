import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login, Home as Lobby, LeaderBoard, Game, WaitingList } from './Web/Componets/Pages';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/waiting-list" element={<WaitingList />} />
      </Routes>
    </Router>
  );
}

export default App;
