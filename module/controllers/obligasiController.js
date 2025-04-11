const obligasiService = require("../services/obligasiService");

async function get(req, res) {
  try {
    const data = await obligasiService.getObligasi();
    res.status(201).json({ message: "obligasi yield dan marketcap data", data: data });
  } catch (err) {
    res.status(500).json({ message: "obligasi yield dan marketcap error", data: err.message });
  }
}

module.exports = {
  get
};