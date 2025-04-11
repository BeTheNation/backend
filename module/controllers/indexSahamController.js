const indexSahamService = require("../services/indexSahamService");

async function get(req, res) {
  try {
    const data = await indexSahamService.getIndexSaham();
    res.status(201).json({ message: "index saham data", data: data });
  } catch (err) {
    res.status(500).json({ message: "index saham error", data: err.message });
  }
}

module.exports = {
  get
};