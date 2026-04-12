import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";
import { sha256 } from "./hash.js";
import { runEngine } from "./engine.js";
import Round from "./models/Round.js";

dotenv.config();

const app = express();
const rounds = {}; // 👈 ADD THIS - in-memory storage

app.use(cors());
app.use(express.json());

// Only connect to MongoDB if you're using it
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI);
  mongoose.connection.once("open", () => {
    console.log("✅ MongoDB connected");
  });
}

process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 UNHANDLED REJECTION:", err);
});

// ✅ TEST ROUTE (put this first for quick testing)
app.get("/test", (req, res) => {
  console.log("✅ TEST ROUTE HIT");
  res.json({ message: "Server working", routes: ["/api/rounds/commit", "/api/verify", "/api/rounds/:id/start"] });
});

// ✅ COMMIT
app.post("/api/rounds/commit", (req, res) => {
  try {
    console.log("👉 COMMIT ROUTE HIT");
    
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

    console.log("✅ ROUND CREATED:", roundId);
    console.log("📦 Current rounds:", Object.keys(rounds));

    res.status(200).json({
      roundId,
      commitHex,
      nonce,
    });

  } catch (err) {
    console.error("❌ COMMIT ERROR:", err);
    res.status(500).json({
      error: "Commit failed",
      message: err.message,
    });
  }
});

// ✅ VERIFY ENDPOINT
app.get("/api/verify", (req, res) => {
  const { serverSeed, clientSeed, nonce, dropColumn } = req.query;

  if (!serverSeed || !clientSeed || !nonce || dropColumn === undefined) {
    return res.status(400).json({ error: "Missing params" });
  }

  const commitHex = sha256(`${serverSeed}:${nonce}`);
  const result = runEngine({
    serverSeed,
    clientSeed,
    nonce,
    dropColumn: Number(dropColumn),
  });

  res.json({
    commitHex,
    combinedSeed: result.combinedSeed,
    pegMapHash: result.pegMapHash,
    binIndex: result.binIndex,
  });
});

// ✅ START
app.post("/api/rounds/:id/start", (req, res) => {
  console.log("👉 START ROUTE HIT for ID:", req.params.id);
  
  const round = rounds[req.params.id];

  if (!round) {
    console.log("❌ Round not found. Available:", Object.keys(rounds));
    return res.status(404).json({ error: "Round not found" });
  }

  const { clientSeed, dropColumn, betCents } = req.body;

  if (!clientSeed || dropColumn === undefined) {
    return res.status(400).json({ error: "Missing clientSeed or dropColumn" });
  }

  try {
    const result = runEngine({
      serverSeed: round.serverSeed,
      clientSeed,
      nonce: round.nonce,
      dropColumn,
    });

    round.clientSeed = clientSeed;
    round.combinedSeed = result.combinedSeed;
    round.pegMapHash = result.pegMapHash;
    round.pathJson = result.path;
    round.binIndex = result.binIndex;
    round.rows = 12;
    round.status = "STARTED";
    round.betCents = betCents || 100;

    res.json({
      pegMapHash: result.pegMapHash,
      rows: 12,
      binIndex: result.binIndex,
    });
  } catch (err) {
    console.error("❌ Engine error:", err);
    res.status(500).json({ error: "Engine failed", message: err.message });
  }
});

// ✅ REVEAL
app.post("/api/rounds/:id/reveal", (req, res) => {
  console.log("👉 REVEAL ROUTE HIT for ID:", req.params.id);
  
  const round = rounds[req.params.id];

  if (!round) {
    return res.status(404).json({ error: "Round not found" });
  }

  round.status = "REVEALED";

  res.json({
    serverSeed: round.serverSeed,
  });
});

// ✅ GET ROUND (fixed for in-memory)
app.get("/api/rounds/:id", (req, res) => {
  console.log("👉 GET ROUTE HIT for ID:", req.params.id);
  
  const round = rounds[req.params.id];
  
  if (!round) {
    return res.status(404).json({ error: "Round not found" });
  }
  
  res.json(round);
});

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("Plinko Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});