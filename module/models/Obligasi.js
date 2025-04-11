const mongoose = require("mongoose");

const FuturePositionSchema = new mongoose.Schema({
  entry: { type: Number, required: true },
  current: { type: Number, required: true },
  pnl: { type: Number, required: true },
  pnl_pct: { type: Number, required: true },
  is_liquidated: { type: Boolean, required: true }
}, { _id: false });

const SimulationSchema = new mongoose.Schema({
  leverage: { type: Number, required: true, default: 5 },
  margin: { type: Number, required: true, default: 1000000 },
  long: { type: FuturePositionSchema, required: true },
  short: { type: FuturePositionSchema, required: true }
}, { _id: false });

const ObligasiSchema = new mongoose.Schema({
  tanggal: { type: Date, required: true },
  yield: { type: Number, required: true },
  pembukaan: { type: Number, required: true },
  tertinggi: { type: Number, required: true },
  terendah: { type: Number, required: true },
  perubahan_pct: { type: Number, required: true },
  future_simulation: { type: SimulationSchema, required: false }
}, {
  timestamps: true,
  collection: 'obligasi_yield'
});

module.exports = mongoose.model('Obligasi', ObligasiSchema);