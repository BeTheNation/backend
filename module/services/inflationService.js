const Inflation = require("../models/Inflation");

async function getInflation() {
  // https://tradingeconomics.com/indonesia/inflation-cpi
  const data = [
    {
      "country": "Indonesia",
      "type": "CPI",
      "period": "Jan 2025",
      "monthly_rate_pct": 0.76,
      "yearly_rate_pct": 9.40
    },
    {
      "country": "Indonesia",
      "type": "CPI",
      "period": "Feb 2025",
      "monthly_rate_pct": -0.09,
      "yearly_rate_pct": 4.1
    },
    {
      "country": "Indonesia",
      "type": "CPI",
      "period": "Mar 2025",
      "monthly_rate_pct": 1.03,
      "yearly_rate_pct": 6.92
    },
    {
      "country": "United States",
      "type": "CPI",
      "period": "Jan 2025",
      "monthly_rate_pct": 0.5,
      "yearly_rate_pct": 3
    },
    {
      "country": "United States",
      "type": "CPI",
      "period": "Feb 2025",
      "monthly_rate_pct": 0.2,
      "yearly_rate_pct": 2.8
    }
  ];

  const result = await Inflation.insertMany(data);
  return result;
}

module.exports = {
  getInflation
};