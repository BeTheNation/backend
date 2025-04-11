const mongoose = require("mongoose");

// const currencyExchangeSchema = new mongoose.Schema({
//   timestamp: { type: Number, required: true },
//   date: { type: String, required: true },
//   base: { type: String, required: true },
//   rates: {
//     type: Map, of: Number, required: true
//   }
// });

const currencyExchangeSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  source: { type: String, required: true },
  quotes: {
    type: Map, of: Number, required: true
  }
});

module.exports = mongoose.model("CurrencyExchange", currencyExchangeSchema);