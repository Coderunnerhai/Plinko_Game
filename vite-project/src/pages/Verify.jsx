import { useState } from 'react';
import Game from './pages/Game';
import Verify from './pages/Verify';

function App() {
  const [showVerifier, setShowVerifier] = useState(false);

  return (
    <div>
      {/* Navigation Buttons */}
      <div style={{ 
        padding: '15px', 
        background: '#1a1a2e', 
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        borderBottom: '2px solid #16213e'
      }}>
        <button 
          onClick={() => setShowVerifier(false)}
          style={{
            padding: '10px 30px',
            fontSize: '18px',
            background: !showVerifier ? '#e94560' : '#0f3460',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          🎮 Play Plinko
        </button>
        <button 
          onClick={() => setShowVerifier(true)}
          style={{
            padding: '10px 30px',
            fontSize: '18px',
            background: showVerifier ? '#e94560' : '#0f3460',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          🔐 Verify Fairness
        </button>
      </div>

      {/* Page Content - No URL routing needed */}
      {showVerifier ? <Verify /> : <Game />}
    </div>
  );
}

export default App;