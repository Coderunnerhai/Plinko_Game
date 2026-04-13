import { useState } from 'react';
import Game from './pages/Game';
import Verify from './pages/Verify';

function App() {
  const [showGame, setShowGame] = useState(true);

  return (
    <div>
      {/* Simple toggle buttons */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px',
        background: '#282c34',
        borderBottom: '2px solid #61dafb'
      }}>
        <button 
          onClick={() => setShowGame(true)}
          style={{
            margin: '0 10px',
            padding: '10px 20px',
            background: showGame ? '#61dafb' : '#444',
            color: showGame ? '#282c34' : 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🎮 Game
        </button>
        <button 
          onClick={() => setShowGame(false)}
          style={{
            margin: '0 10px',
            padding: '10px 20px',
            background: !showGame ? '#61dafb' : '#444',
            color: !showGame ? '#282c34' : 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🔐 Verifier
        </button>
      </div>

      {/* Show either Game or Verifier */}
      {showGame ? <Game /> : <Verify />}
    </div>
  );
}

export default App;