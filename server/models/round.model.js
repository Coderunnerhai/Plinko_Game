import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  status: String,

  nonce: String,
  commitHex: String,
  serverSeed: String,
  clientSeed: String,
  combinedSeed: String,
  pegMapHash: String,

  rows: Number,
  dropColumn: Number,
  binIndex: Number,
  payoutMultiplier: Number,
  betCents: Number,
  pathJson: Array,

  revealedAt: Date,
});

export default mongoose.model("Round", roundSchema);