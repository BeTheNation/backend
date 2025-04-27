const currencyExchangeService = require("../services/currencyExchangeService");

async function get(req, res) {
  try {
    const data = await currencyExchangeService.getCurrencyExchange();
    res.status(201).json({ message: "Currency Exchange data", data: data });
  } catch (err) {
    res.status(500).json({ message: "Currency Exchange error", data: err.message });
  }
}

async function forceUpdate(req, res) {
  try {
    const result = await currencyExchangeService.getCurrencyExchange(true);
    res.status(200).json({
      message: "Currency exchange data updated successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating currency exchange data",
      error: error.message
    });
  }
}

module.exports = {
  get,
  forceUpdate
};