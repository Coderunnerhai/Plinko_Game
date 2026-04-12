import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "CREATED" },

  // Fairness
  nonce: String,
  commitHex: String,
  serverSeed: String,
  clientSeed: String,
  combinedSeed: String,
  pegMapHash: String,

  // Game
  rows: Number,
  dropColumn: Number,
  binIndex: Number,
  payoutMultiplier: Number,
  betCents: Number,
  pathJson: [String],

  revealedAt: Date,
});

export default mongoose.model("Round", roundSchema);