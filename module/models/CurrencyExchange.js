const mongoose = require("mongoose");

const currencyExchangeSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  source: { type: String, required: true },
  quotes: {
    type: Map, of: Number, required: true
  },
  short: { type: String, required: true },
  long: { type: String, required: true },
});

module.exports = mongoose.model("CurrencyExchange", currencyExchangeSchema);