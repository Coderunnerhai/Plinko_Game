import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();

// ✅ FIXED CORS CONFIGURATION
app.use(cors({
  origin: [
    'http://localhost:3000',           // Local development
    'http://localhost:5173',            // Vite default
    'https://plinko-game-gd17-qixxdwi24-nikhiltiwari946-7388s-projects.vercel.app',  // Your Vercel frontend
    /\.vercel\.app$/                    // Allow all Vercel preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rest of your code remains the same...
const rounds = {};

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

app.get("/", (req, res) => {
  res.send("Plinko Backend Running 🚀");
});

app.get("/test", (req, res) => {
  res.json({ message: "Test route works!", time: new Date().toISOString() });
});

app.post("/api/rounds/commit", (req, res) => {
  console.log("✅ Commit route hit from:", req.headers.origin);
  
  const serverSeed = crypto.randomBytes(32).toString("hex");
  const nonce = Date.now().toString();
  const commitHex = sha256(`${serverSeed}:${nonce}`);
  const roundId = crypto.randomBytes(16).toString("hex");

  rounds[roundId] = { 
    serverSeed, 
    nonce, 
    commitHex, 
    status: "CREATED" 
  };

  res.json({ roundId, commitHex, nonce });
});

app.post("/api/rounds/:id/start", (req, res) => {
  console.log(`✅ Start route hit for: ${req.params.id}`);
  
  const round = rounds[req.params.id];
  if (!round) {
    return res.status(404).json({ error: "Round not found" });
  }

  const { clientSeed, dropColumn, betCents } = req.body;
  
  if (!clientSeed || dropColumn === undefined) {
    return res.status(400).json({ error: "Missing clientSeed or dropColumn" });
  }

  const combinedSeed = sha256(`${round.serverSeed}:${clientSeed}:${round.nonce}`);
  const pegMapHash = sha256("plinko_peg_map_v1");
  
  const path = [];
  let pos = 0;
  for (let i = 0; i < 12; i++) {
    const rand = Math.random();
    if (rand < 0.5) {
      path.push("L");
    } else {
      path.push("R");
      pos++;
    }
  }
  const binIndex = pos;

  round.clientSeed = clientSeed;
  round.combinedSeed = combinedSeed;
  round.pegMapHash = pegMapHash;
  round.pathJson = path;
  round.binIndex = binIndex;
  round.betCents = betCents || 100;
  round.status = "STARTED";

  res.json({ 
    pegMapHash, 
    rows: 12, 
    binIndex,
    path 
  });
});

app.post("/api/rounds/:id/reveal", (req, res) => {
  console.log(`✅ Reveal route hit for: ${req.params.id}`);
  
  const round = rounds[req.params.id];
  if (!round) {
    return res.status(404).json({ error: "Round not found" });
  }

  round.status = "REVEALED";
  res.json({ serverSeed: round.serverSeed });
});

app.get("/api/rounds/:id", (req, res) => {
  console.log(`✅ Get round hit for: ${req.params.id}`);
  
  const round = rounds[req.params.id];
  if (!round) {
    return res.status(404).json({ error: "Round not found" });
  }
  res.json(round);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});