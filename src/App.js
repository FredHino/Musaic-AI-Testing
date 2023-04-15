import React, { useState } from "react";
import './App.css';
import Friends from "./components/Friends";
import Lobby from "./components/Lobby";

function App() {
  const [userId, setUserId] = useState(1);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">React Top Tracks</h1>
      </header>
      <Friends userId={userId} />
      <Lobby userId={userId} />
    </div>
  );
}

export default App;