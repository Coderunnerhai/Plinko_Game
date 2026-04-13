import { useState } from 'react';
import Game from './pages/Game';
import Verify from './pages/Verify';

function App() {
  const [page, setPage] = useState('game');

  return (
    <div>
      {/* Navigation Bar */}
      <div style={{ 
        padding: '10px', 
        background: '#333', 
        color: 'white',
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => setPage('game')}
          style={{
            padding: '8px 16px',
            background: page === 'game' ? '#007bff' : '#555',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          🎮 Game
        </button>
        <button 
          onClick={() => setPage('verify')}
          style={{
            padding: '8px 16px',
            background: page === 'verify' ? '#007bff' : '#555',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          🔐 Verifier
        </button>
      </div>

      {/* Page Content */}
      {page === 'game' ? <Game /> : <Verify />}
    </div>
  );
}

export default App;