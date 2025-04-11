const inflationService = require("../services/inflationService");

async function get(req, res) {
  try {
    const data = await inflationService.getInflation();
    res.status(201).json({ message: "Inflation data", data: data });
  } catch (err) {
    res.status(500).json({ message: "Inflation error", data: err.message });
  }
}

module.exports = {
  get
};