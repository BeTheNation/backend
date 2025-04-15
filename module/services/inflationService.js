const Inflation = require("../models/Inflation");

async function getInflation() {
  // https://tradingeconomics.com/indonesia/inflation-cpi
  await Inflation.deleteMany({});
  const rawData = [
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
  const result = [];
  const sortedData = rawData.sort((a, b) => {
    return parsePeriod(a.period) - parsePeriod(b.period);
  });



  for (const entry of sortedData) {
    const exists = await Inflation.findOne({
      country: entry.country,
      period: entry.period,
    });

    if (!exists) {
      const { monthly_rate_pct, yearly_rate_pct } = entry;
      const { short, long } = calculatePredictions(monthly_rate_pct, yearly_rate_pct);

      const enrichedEntry = {
        ...entry,
        short: parseFloat(short.toFixed(2)),
        long: parseFloat(long.toFixed(2)),
      };

      const saved = await Inflation.create(enrichedEntry);
      result.push(saved);
    }
  }
  return result;
}

function parsePeriod(periodStr) {
  const [monthStr, year] = periodStr.split(" ");
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3,
    May: 4, Jun: 5, Jul: 6, Aug: 7,
    Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  return new Date(year, months[monthStr]);
}

function calculatePredictions(monthly, yearly) {
  const short = (monthly * 2) - yearly;
  const long = yearly - monthly;
  return { short, long };
}

module.exports = {
  getInflation
};