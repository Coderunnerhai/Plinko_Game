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

  const verify = async () => {
    try {
      const res = await axios.get("http://localhost:5100/api/verify", {
        params: form,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Verify Round</h2>

      <input
        placeholder="serverSeed"
        value={form.serverSeed}
        onChange={(e) =>
          setForm({ ...form, serverSeed: e.target.value })
        }
      />
      <br />

      <input
        placeholder="clientSeed"
        value={form.clientSeed}
        onChange={(e) =>
          setForm({ ...form, clientSeed: e.target.value })
        }
      />
      <br />

      <input
        placeholder="nonce"
        value={form.nonce}
        onChange={(e) =>
          setForm({ ...form, nonce: e.target.value })
        }
      />
      <br />

      <input
        type="number"
        value={form.dropColumn}
        onChange={(e) =>
          setForm({ ...form, dropColumn: Number(e.target.value) })
        }
      />
      <br />

      <button onClick={verify}>Verify</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}