import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage (no MongoDB needed for now)
const rounds = {};

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// Health check endpoint (required for Render)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Render backend is working!" });
});

// Commit endpoint
app.post("/api/rounds/commit", (req, res) => {
  console.log("✅ Commit route hit on Render");
  
  const serverSeed = crypto.randomBytes(32).toString("hex");
  const nonce = Date.now().toString();
  const commitHex = sha256(`${serverSeed}:${nonce}`);
  const roundId = crypto.randomBytes(16).toString("hex");

  rounds[roundId] = {
    serverSeed,
    nonce,
    commitHex,
    status: "CREATED",
  };

  res.json({
    roundId,
    commitHex,
    nonce,
  });
});

// Start endpoint
app.post("/api/rounds/:id/start", (req, res) => {
  const round = rounds[req.params.id];
  if (!round) {
    return res.status(404).json({ error: "Round not found" });
  }

  const { clientSeed, dropColumn } = req.body;
  
  // Simple deterministic outcome for testing
  const result = {
    combinedSeed: "test_seed",
    pegMapHash: "test_hash",
    path: ["L", "R", "L"],
    binIndex: dropColumn || 6
  };

  round.clientSeed = clientSeed;
  round.combinedSeed = result.combinedSeed;
  round.pegMapHash = result.pegMapHash;
  round.pathJson = result.path;
  round.binIndex = result.binIndex;
  round.status = "STARTED";

  res.json({
    pegMapHash: result.pegMapHash,
    rows: 12,
    binIndex: result.binIndex
  });
});

// Reveal endpoint
app.post("/api/rounds/:id/reveal", (req, res) => {
  const round = rounds[req.params.id];
  if (!round) {
    return res.status(404).json({ error: "Round not found" });
  }
  
  round.status = "REVEALED";
  res.json({ serverSeed: round.serverSeed });
});

// Get round endpoint
app.get("/api/rounds/:id", (req, res) => {
  const round = rounds[req.params.id];
  if (!round) {
    return res.status(404).json({ error: "Round not found" });
  }
  res.json(round);
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Plinko Backend Running 🚀");
});

// Important: Bind to 0.0.0.0 and use process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});