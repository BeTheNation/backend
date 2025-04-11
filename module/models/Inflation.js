const mongoose = require("mongoose");

const inflationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  type: { type: String, required: true },
  period: { type: String, required: true },
  monthly_rate_pct: { type: Number, required: true },
  yearly_rate_pct: { type: Number, required: true },
});

module.exports = mongoose.model("Inflation", inflationSchema);