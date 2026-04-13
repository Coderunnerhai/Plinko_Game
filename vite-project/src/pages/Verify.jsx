import { useState } from "react";
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

  // ✅ Use your deployed Render backend
  const BASE_URL = "https://plinko-game-3.onrender.com";

  const verify = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`${BASE_URL}/api/verify`, {
        params: {
          serverSeed: form.serverSeed,
          clientSeed: form.clientSeed,
          nonce: form.nonce,
          dropColumn: Number(form.dropColumn)
        },
      });
      setResult(res.data);
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.response?.data?.error || err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔐 Verify Round Fairness</h2>
      <p>Enter the server seed, client seed, nonce, and drop column to verify a round.</p>

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="serverSeed"
          value={form.serverSeed}
          onChange={(e) => setForm({ ...form, serverSeed: e.target.value })}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }}
        />

        <input
          placeholder="clientSeed"
          value={form.clientSeed}
          onChange={(e) => setForm({ ...form, clientSeed: e.target.value })}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }}
        />

        <input
          placeholder="nonce"
          value={form.nonce}
          onChange={(e) => setForm({ ...form, nonce: e.target.value })}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }}
        />

        <input
          type="number"
          placeholder="dropColumn (0-12)"
          value={form.dropColumn}
          onChange={(e) => setForm({ ...form, dropColumn: e.target.value })}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }}
        />

        <button 
          onClick={verify} 
          disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {loading ? "Verifying..." : "Verify Round"}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: 20, padding: 10, background: '#ffeeee', borderRadius: 5 }}>
          ❌ Error: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>✅ Verification Result:</h3>
          <pre style={{ background: '#f0f0f0', padding: 15, borderRadius: 5, overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}