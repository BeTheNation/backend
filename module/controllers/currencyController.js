const currencyExchangeService = require("../services/currencyExchangeService");

async function get(req, res) {
  try {
    const data = await currencyExchangeService.getCurrencyExchange();
    res.status(201).json({ message: "Currency Exchange data", data: data });
  } catch (err) {
    res.status(500).json({ message: "Currency Exchange error", data: err.message });
  }
}

module.exports = {
  get
};