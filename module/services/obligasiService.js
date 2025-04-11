const Obligasi = require("../models/Obligasi");

async function getObligasi() {
  // https://www.idx.co.id/id/data-pasar/data-saham/indeks-saham
  const data = [
{
"tanggal": "2025-04-10",
"yield": 6.935,
"pembukaan": 7.003,
"tertinggi": 7.005,
"terendah": 6.917,
"perubahan_pct": 0.51,
"future_simulation": {
"leverage": 5,
"margin": 1000000,
"long": {
"entry": 6.935,
"current": 7.28175,
"pnl": 250620.13,
"pnl_pct": 25.06,
"is_liquidated": false
},
"short": {
"entry": 6.935,
"current": 6.58825,
"pnl": 250620.13,
"pnl_pct": 25.06,
"is_liquidated": false
}
}
},
{
"tanggal": "2025-04-09",
"yield": 6.899,
"pembukaan": 6.846,
"tertinggi": 6.942,
"terendah": 6.844,
"perubahan_pct": 1.41,
"future_simulation": {
"leverage": 5,
"margin": 1000000,
"long": {
"entry": 6.899,
"current": 7.24395,
"pnl": 250000.0,
"pnl_pct": 25.0,
"is_liquidated": false
},
"short": {
"entry": 6.899,
"current": 6.55405,
"pnl": 250000.0,
"pnl_pct": 25.0,
"is_liquidated": false
}
}
},
{
"tanggal": "2025-04-08",
"yield": 6.804,
"pembukaan": 6.841,
"tertinggi": 6.911,
"terendah": 6.791,
"perubahan_pct": 0.61,
"future_simulation": {
"leverage": 5,
"margin": 1000000,
"long": {
"entry": 6.804,
"current": 7.1442,
"pnl": 250000.0,
"pnl_pct": 25.0,
"is_liquidated": false
},
"short": {
"entry": 6.804,
"current": 6.4638,
"pnl": 250000.0,
"pnl_pct": 25.0,
"is_liquidated": false
}
}
},
{
"tanggal": "2025-03-27",
"yield": 6.762,
"pembukaan": 6.832,
"tertinggi": 6.837,
"terendah": 6.793,
"perubahan_pct": -0.53,
"future_simulation": {
"leverage": 5,
"margin": 1000000,
"long": {
"entry": 6.762,
"current": 7.1001,
"pnl": 249999.99,
"pnl_pct": 25.0,
"is_liquidated": false
},
"short": {
"entry": 6.762,
"current": 6.4239,
"pnl": 249999.99,
"pnl_pct": 25.0,
"is_liquidated": false
}
}
},
{
"tanggal": "2025-03-26",
"yield": 6.798,
"pembukaan": 6.98,
"tertinggi": 6.98,
"terendah": 6.83,
"perubahan_pct": -2.4,
"future_simulation": {
"leverage": 5,
"margin": 1000000,
"long": {
"entry": 6.798,
"current": 7.1379,
"pnl": 250000.0,
"pnl_pct": 25.0,
"is_liquidated": false
},
"short": {
"entry": 6.798,
"current": 6.4581,
"pnl": 250000.0,
"pnl_pct": 25.0,
"is_liquidated": false
}
}
}
];

  const result = await Obligasi.insertMany(data);
  return result;
}

module.exports = {
  getObligasi
};