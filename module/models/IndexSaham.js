const mongoose = require("mongoose");

const FutureInfoSchema = new mongoose.Schema({
  entry_price: { type: Number, required: true },
  current_price: { type: Number, required: true },
  leverage: { type: Number, required: true },
  initial_margin: { type: Number, required: true },
  position_size: { type: Number, required: true },
  pnl: { type: Number, required: true },
  is_liquidated: { type: Boolean, required: true },
  is_long: { type: Boolean, default: true }
});

const IndeksSahamSchema = new mongoose.Schema({
  kode_saham: { type: String, required: true },
  tanggal: { type: Date, required: true },
  harga_penutupan: { type: Number, required: true },
  volume: { type: Number, required: true },
  index: { type: String, enum: ["IDX30", "LQ45"], required: true },
  funding_rate: { type: Number, default: 0 },
  future_info: { type: FutureInfoSchema, required: true }
});

module.exports = mongoose.model("IndexSaham", IndeksSahamSchema);