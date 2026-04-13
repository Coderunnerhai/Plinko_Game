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

  // ✅ IMPORTANT: Use your Render backend URL
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
      console.log("Verification result:", res.data);
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h2>🔐 Verify Round</h2>
      
      <input
        type="text"
        placeholder="Server Seed"
        value={form.serverSeed}
        onChange={(e) => setForm({ ...form, serverSeed: e.target.value })}
        style={{ display: 'block', width: '100%', margin: '10px 0', padding: 8 }}
      />
      
      <input
        type="text"
        placeholder="Client Seed"
        value={form.clientSeed}
        onChange={(e) => setForm({ ...form, clientSeed: e.target.value })}
        style={{ display: 'block', width: '100%', margin: '10px 0', padding: 8 }}
      />
      
      <input
        type="text"
        placeholder="Nonce"
        value={form.nonce}
        onChange={(e) => setForm({ ...form, nonce: e.target.value })}
        style={{ display: 'block', width: '100%', margin: '10px 0', padding: 8 }}
      />
      
      <input
        type="number"
        placeholder="Drop Column (0-12)"
        value={form.dropColumn}
        onChange={(e) => setForm({ ...form, dropColumn: e.target.value })}
        style={{ display: 'block', width: '100%', margin: '10px 0', padding: 8 }}
      />
      
      <button 
        onClick={verify} 
        disabled={loading}
        style={{ padding: '10px 20px', marginTop: 10, cursor: 'pointer' }}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
      
      {error && <p style={{ color: 'red', marginTop: 20 }}>Error: {error}</p>}
      
      {result && (
        <pre style={{ background: '#f0f0f0', padding: 15, marginTop: 20, overflow: 'auto' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}