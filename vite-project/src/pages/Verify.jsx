import { useState, useEffect } from "react";
import axios from "axios";

export default function Verify() {
  const [form, setForm] = useState({
    serverSeed: "",
    clientSeed: "",
    nonce: "",
    dropColumn: 6,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    // Get backend URL from environment or use default
    const url = import.meta.env?.VITE_API_URL || "https://plinko-game-3.onrender.com";
    setApiUrl(url);
    console.log("Using backend URL:", url);
  }, []);

  const verify = async () => {
    if (!apiUrl) {
      setError("API URL not configured");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("Verifying with:", { ...form, apiUrl });
      
      const res = await axios.get(`${apiUrl}/api/verify`, {
        params: {
          serverSeed: form.serverSeed,
          clientSeed: form.clientSeed,
          nonce: form.nonce,
          dropColumn: Number(form.dropColumn)
        },
        timeout: 10000 // 10 second timeout
      });
      
      setResult(res.data);
      console.log("Verification successful:", res.data);
    } catch (err) {
      console.error("Verification error details:", err);
      
      if (err.code === "ERR_NETWORK") {
        setError(`Cannot connect to backend at ${apiUrl}. Make sure your backend is running.`);
      } else if (err.response?.status === 404) {
        setError("API endpoint not found. Check if backend has /api/verify route.");
      } else {
        setError(err.response?.data?.error || err.message || "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ color: '#e94560' }}>🔐 Verify Round Fairness</h2>
      <p>Enter the seeds and nonce to verify any round's outcome.</p>

      <div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Server Seed:</label>
          <input
            type="text"
            placeholder="Enter server seed"
            value={form.serverSeed}
            onChange={(e) => setForm({ ...form, serverSeed: e.target.value })}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Client Seed:</label>
          <input
            type="text"
            placeholder="Enter client seed"
            value={form.clientSeed}
            onChange={(e) => setForm({ ...form, clientSeed: e.target.value })}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Nonce:</label>
          <input
            type="text"
            placeholder="Enter nonce"
            value={form.nonce}
            onChange={(e) => setForm({ ...form, nonce: e.target.value })}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Drop Column (0-12):</label>
          <input
            type="number"
            min="0"
            max="12"
            placeholder="6"
            value={form.dropColumn}
            onChange={(e) => setForm({ ...form, dropColumn: e.target.value })}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        <button 
          onClick={verify} 
          disabled={loading || !apiUrl}
          style={{ 
            padding: '10px 20px', 
            cursor: 'pointer',
            backgroundColor: '#e94560',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 16
          }}
        >
          {loading ? "Verifying..." : "Verify Round"}
        </button>
      </div>

      {error && (
        <div style={{ 
          marginTop: 20, 
          padding: 10, 
          backgroundColor: '#ffebee', 
          border: '1px solid #ef9a9a',
          borderRadius: 4,
          color: '#c62828'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>✅ Verification Result:</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: 15, 
            borderRadius: 4, 
            overflow: 'auto',
            fontSize: 12
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: 20, fontSize: 12, color: '#666' }}>
        <p>Backend URL: {apiUrl || "Not configured"}</p>
      </div>
    </div>
  );
}