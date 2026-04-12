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

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected");
});

// ✅ COMMIT
app.post("/api/rounds/commit", async (req, res) => {
  const serverSeed = crypto.randomBytes(32).toString("hex");
  const nonce = crypto.randomUUID(); // ✅ FIXED

  const commitHex = sha256(`${serverSeed}:${nonce}`);

  const round = await Round.create({
    serverSeed,
    nonce,
    commitHex,
    status: "CREATED",
  });

  res.json({
    roundId: round._id,
    commitHex,
    nonce,
  });
});

// ✅ VERIFY ENDPOINT
app.get("/api/verify", (req, res) => {
  const { serverSeed, clientSeed, nonce, dropColumn } = req.query;

  // 🔒 validation
  if (!serverSeed || !clientSeed || !nonce || dropColumn === undefined) {
    return res.status(400).json({ error: "Missing params" });
  }

  // 🔐 recompute commit
  const commitHex = sha256(`${serverSeed}:${nonce}`);

  // 🎯 recompute full engine
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
app.post("/api/rounds/:id/start", async (req, res) => {
  const round = await Round.findById(req.params.id);
  if (!round) return res.status(404).send("Round not found");

  const { clientSeed, dropColumn, betCents } = req.body;

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
  round.dropColumn = dropColumn;
  round.betCents = betCents;
  round.status = "STARTED";

  await round.save();

  res.json({
    pegMapHash: result.pegMapHash,
    rows: 12,
  });
});

// ✅ REVEAL
app.post("/api/rounds/:id/reveal", async (req, res) => {
  const round = await Round.findById(req.params.id);
  if (!round) return res.status(404).send("Round not found");

  round.status = "REVEALED";
  round.revealedAt = new Date();

  await round.save();

  res.json({
    serverSeed: round.serverSeed,
  });
});
// ✅ GET ROUND
app.get("/api/rounds/:id", async (req, res) => {
  const round = await Round.findById(req.params.id);
  res.json(round);
});
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Plinko Backend Running 🚀");
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});