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

  // ✅ Use environment variable or deployed backend URL
  const BASE_URL = import.meta.env.VITE_API_URL || "https://plinko-game-3.onrender.com";

  const verify = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`${BASE_URL}/api/verify`, {
        params: form,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔐 Verify Round Fairness</h2>
      <p>Enter the server seed, client seed, nonce, and drop column to verify a round.</p>

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
        onChange={(e) => setForm({ ...form, dropColumn: Number(e.target.value) })}
        style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }}
      />

      <button onClick={verify} disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        {loading ? "Verifying..." : "Verify Round"}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          Error: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Verification Result:</h3>
          <pre style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}