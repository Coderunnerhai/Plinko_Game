import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

// Simple SHA256
function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const rounds = {};

// TEST ROUTE - Visit this first to verify deployment
app.get("/test", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running with API routes!",
    time: new Date().toISOString()
  });
});

// MAIN API ROUTE
app.post("/api/rounds/commit", (req, res) => {
  console.log("✅ Commit route hit!");
  
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

app.get("/", (req, res) => {
  res.send("Plinko Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Test route: http://localhost:${PORT}/test`);
  console.log(`✅ API route: http://localhost:${PORT}/api/rounds/commit`);
});