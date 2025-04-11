const IndexSaham = require("../models/IndexSaham");

async function getIndexSaham() {
  // https://www.idx.co.id/id/data-pasar/data-saham/indeks-saham
  const data = [
    {
      "tanggal": "2024-06-01",
      "kode_saham": "ADRO",
      "harga_penutupan": 2800,
      "volume": 520000,
      "index": "IDX30",
      "funding_rate": 0.01,
      "future_info": {
        "entry_price": 2800,
        "current_price": 2660,
        "leverage": 5,
        "initial_margin": 1000000,
        "position_size": 5000000,
        "pnl": -250000,
        "is_liquidated": false
      }
    },
    {
      "tanggal": "2024-06-01",
      "kode_saham": "ANTM",
      "harga_penutupan": 1820,
      "volume": 310000,
      "index": "IDX30",
      "funding_rate": -0.008,
      "future_info": {
        "entry_price": 1820,
        "current_price": 1700,
        "leverage": 5,
        "initial_margin": 1000000,
        "position_size": 5000000,
        "pnl": -329670,
        "is_liquidated": false
      }
    },
    {
      "tanggal": "2024-06-01",
      "kode_saham": "ACES",
      "harga_penutupan": 850,
      "volume": 200000,
      "index": "LQ45",
      "funding_rate": 0.004,
      "future_info": {
        "entry_price": 850,
        "current_price": 807.5,
        "leverage": 5,
        "initial_margin": 1000000,
        "position_size": 5000000,
        "pnl": -25000,
        "is_liquidated": false
      }
    },
    {
      "tanggal": "2024-06-01",
      "kode_saham": "KLBF",
      "harga_penutupan": 1600,
      "volume": 100000,
      "index": "LQ45",
      "funding_rate": 0.006,
      "future_info": {
        "entry_price": 1600,
        "current_price": 1520,
        "leverage": 5,
        "initial_margin": 1000000,
        "position_size": 5000000,
        "pnl": -250000,
        "is_liquidated": false
      }
    }
  ];

  const result = await IndexSaham.insertMany(data);
  return result;
}

module.exports = {
  getIndexSaham
};