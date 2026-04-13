import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Game from './pages/Game';
import Verify from './pages/Verify';

function App() {
  return (
    <HashRouter>
      <div>
        {/* Navigation Bar */}
        <nav style={{ 
          padding: '10px', 
          background: '#333', 
          color: 'white',
          display: 'flex',
          gap: '10px'
        }}>
          <Link 
            to="/" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '8px 16px',
              background: '#007bff',
              borderRadius: '4px'
            }}
          >
            🎮 Game
          </Link>
          <Link 
            to="/verify" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '8px 16px',
              background: '#28a745',
              borderRadius: '4px'
            }}
          >
            🔐 Verifier
          </Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;