const FinalScore = require("../models/FinalScore");
const Inflation = require("../models/Inflation");
const CurrencyExchange = require("../models/CurrencyExchange");
const Obligasi = require("../models/Obligasi");
const IndexSaham = require("../models/IndexSaham");
const logger = require('../../bin/helper/logger');
const currencyExchangeService = require('../services/currencyExchangeService');

// Normalization ranges
const RANGES = {
  INFLATION: { 
    min: -10, 
    max: 10,
    description: "Inflasi tahunan dalam persen"
  },
  CURRENCY: { 
    min: -10, 
    max: 10,
    description: "Perubahan nilai tukar dalam persen"
  },
  OBLIGASI: { 
    min: -30, 
    max: 30,
    description: "Return obligasi dalam persen"
  },
  SAHAM: { 
    min: -30, 
    max: 30,
    description: "Return saham dalam persen"
  }
};

// Normalize value to 0-100 scale with boundary check and warning
function normalizeValue(value, min, max, indicatorName) {
  const ctx = 'normalize-value';
  
  // Check for extreme values
  if (value < min || value > max) {
    logger.log(ctx, `Warning: ${indicatorName} value (${value}) is outside normal range [${min}, ${max}]`, 'warning');
  }

  // Clamp value to min-max range
  const clampedValue = Math.max(min, Math.min(max, value));
  
  // Log if value was clamped
  if (clampedValue !== value) {
    logger.log(ctx, `Value for ${indicatorName} was clamped from ${value} to ${clampedValue}`, 'warning');
  }

  return ((clampedValue - min) / (max - min)) * 100;
}

// Get risk level based on score
function getRiskLevel(score) {
  if (score >= 80) return "LOW_RISK";          // 80-100
  if (score >= 65) return "LOW_MEDIUM_RISK";   // 65-79
  if (score >= 45) return "MEDIUM_RISK";       // 45-64
  if (score >= 30) return "MEDIUM_HIGH_RISK";  // 30-44
  return "HIGH_RISK";                          // 0-29
}

// Add trend analysis function
function analyzeTrend(current, previous) {
  const percentChange = ((current - previous) / previous) * 100;
  if (Math.abs(percentChange) < 1) return 'STABLE';
  return percentChange > 0 ? 'IMPROVING' : 'DECLINING';
}

// Fungsi untuk menghitung standar deviasi
function stdDev(arr) {
  const n = arr.length;
  if (n === 0) return 1;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
  return Math.sqrt(variance);
}

// Fungsi untuk ambil history nilai indikator (dummy: 3 data terakhir)
async function getHistory(model, field, sortField) {
  const docs = await model.find({ [field]: { $exists: true } }).sort({ [sortField]: -1 }).limit(3);
  return docs.map(d => parseFloat(d[field])).filter(v => !isNaN(v));
}

// Fungsi smoothing moving average
function movingAverage(arr) {
  if (!arr.length) return 1;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Fungsi bobot dinamis kombinasi
async function getDynamicWeights() {
  // Ambil history short-term untuk setiap indikator
  const inflasiHist = await getHistory(Inflation, 'short', 'period');
  const kursHist = await getHistory(CurrencyExchange, 'short', 'timestamp');
  const obligasiHist = await getHistory(Obligasi, 'future_simulation.short.pnl_pct', 'tanggal');
  const sahamHist = await getHistory(IndexSaham, 'future_info.pnl', 'tanggal');

  // Hitung volatilitas (stdDev)
  const volatility = {
    INFLATION: stdDev(inflasiHist),
    CURRENCY: stdDev(kursHist),
    OBLIGASI: stdDev(obligasiHist),
    SAHAM: stdDev(sahamHist)
  };

  // Bobot dasar (rata)
  let base = { INFLATION: 0.25, CURRENCY: 0.25, OBLIGASI: 0.25, SAHAM: 0.25 };
  // Koreksi dengan volatilitas (semakin stabil, bobot makin besar)
  let raw = {};
  let total = 0;
  for (let key in base) {
    raw[key] = base[key] * (1 / (volatility[key] || 1));
    total += raw[key];
  }
  // Smoothing (moving average volatilitas)
  for (let key in raw) {
    raw[key] = movingAverage([raw[key]]); // bisa dikembangkan jika simpan history bobot
  }
  // Normalisasi
  let weights = {};
  for (let key in raw) {
    weights[key] = raw[key] / total;
  }
  return weights;
}

async function calculateFinalScore() {
  const ctx = 'final-score-service';
  try {
    // Force update currency data sebelum perhitungan
    const latestCurrency = await currencyExchangeService.getCurrencyExchange(true);
    
    // Get other indicators
    const [latestInflation, latestObligasi, latestSaham] = await Promise.all([
      Inflation.findOne().sort({ period: -1 }),
      Obligasi.findOne().sort({ tanggal: -1 }),
      IndexSaham.findOne().sort({ tanggal: -1 })
    ]);

    if (!latestInflation || !latestCurrency || !latestObligasi || !latestSaham) {
      throw new Error('Missing data for one or more indicators');
    }

    // Ambil bobot dinamis
    const dynamicWeights = await getDynamicWeights();

    // Calculate scores for each indicator (inject bobot dinamis)
    const indicators = [
      { ...calculateInflationScore(latestInflation), weight: dynamicWeights.INFLATION, is_dummy: !!latestInflation.is_dummy },
      { ...calculateCurrencyScore(latestCurrency), weight: dynamicWeights.CURRENCY, is_dummy: !!latestCurrency.is_dummy },
      { ...calculateObligasiScore(latestObligasi), weight: dynamicWeights.OBLIGASI, is_dummy: !!latestObligasi.is_dummy },
      { ...calculateSahamScore(latestSaham), weight: dynamicWeights.SAHAM, is_dummy: !!latestSaham.is_dummy }
    ];

    // Validate indicators
    indicators.forEach((indicator, index) => {
      if (isNaN(indicator.short_term) || isNaN(indicator.long_term)) {
        throw new Error(`Invalid values for ${indicator.name}: short_term=${indicator.short_term}, long_term=${indicator.long_term}`);
      }
    });

    // Calculate weighted scores with validation
    const weightedScores = indicators.map(indicator => {
      const shortTermWeighted = indicator.short_term * indicator.weight;
      const longTermWeighted = indicator.long_term * indicator.weight;

      if (isNaN(shortTermWeighted) || isNaN(longTermWeighted)) {
        throw new Error(`Invalid weighted score calculation for ${indicator.name}`);
      }

      return {
        ...indicator,
        short_term_weighted: shortTermWeighted,
        long_term_weighted: longTermWeighted,
        is_dummy: indicator.is_dummy
      };
    });

    // Calculate final scores
    const short_term_score = weightedScores.reduce((sum, indicator) => {
      return sum + indicator.short_term_weighted;
    }, 0);
    
    const long_term_score = weightedScores.reduce((sum, indicator) => {
      return sum + indicator.long_term_weighted;
    }, 0);
    
    const final_score = (short_term_score + long_term_score) / 2;

    if (isNaN(final_score)) {
      throw new Error('Invalid final score calculation');
    }

    // Add risk levels
    const risk_assessment = {
      short_term_risk: getRiskLevel(short_term_score),
      long_term_risk: getRiskLevel(long_term_score),
      overall_risk: getRiskLevel(final_score)
    };

    // Save to database
    const finalScore = new FinalScore({
      indicators: weightedScores,
      final_score,
      short_term_score,
      long_term_score,
      risk_assessment
    });

    await finalScore.save();
    logger.log(ctx, 'Final score calculated and saved successfully', 'calculate final score');
    
    return finalScore;
  } catch (error) {
    logger.log(ctx, `Error calculating final score: ${error.message}`, 'error');
    throw error;
  }
}

function calculateInflationScore(inflation) {
  const short = parseFloat(inflation.short);
  const long = parseFloat(inflation.long);
  
  if (isNaN(short) || isNaN(long)) {
    throw new Error(`Invalid inflation values: short=${inflation.short}, long=${inflation.long}`);
  }

  const normalizedShort = normalizeValue(short, RANGES.INFLATION.min, RANGES.INFLATION.max, 'INFLATION');
  const normalizedLong = normalizeValue(long, RANGES.INFLATION.min, RANGES.INFLATION.max, 'INFLATION');

  return {
    name: 'INFLATION',
    short_term: normalizedShort,
    long_term: normalizedLong,
    weight: 0.25,
    metadata: {
      raw_short: short,
      raw_long: long,
      trend: analyzeTrend(long, short),
      range: RANGES.INFLATION
    }
  };
}

function calculateCurrencyScore(currency) {
  const ctx = 'currency-score';
  const currentRate = parseFloat(currency.short);
  const previousRate = parseFloat(currency.long);
  
  if (isNaN(currentRate) || isNaN(previousRate)) {
    throw new Error(`Invalid currency values: current=${currentRate}, previous=${previousRate}`);
  }

  logger.log(ctx, `Raw values - Current Rate: ${currentRate}, Previous Rate: ${previousRate}`, 'input');

  const percentChange = ((currentRate - previousRate) / previousRate) * 100;
  logger.log(ctx, `Percentage change: ${percentChange.toFixed(2)}%`, 'calculation');

  if (Math.abs(percentChange) > RANGES.CURRENCY.max) {
    logger.log(ctx, `Warning: Currency change (${percentChange.toFixed(2)}%) exceeds normal range of ±${RANGES.CURRENCY.max}%`, 'warning');
  }

  const normalizedValue = normalizeValue(percentChange, RANGES.CURRENCY.min, RANGES.CURRENCY.max, 'CURRENCY');
  logger.log(ctx, `Normalized value: ${normalizedValue.toFixed(2)}`, 'result');

  return {
    name: 'CURRENCY',
    short_term: normalizedValue,
    long_term: normalizedValue,
    weight: 0.25,
    metadata: {
      current_rate: currentRate,
      previous_rate: previousRate,
      raw_change_percentage: percentChange,
      trend: analyzeTrend(currentRate, previousRate),
      range: RANGES.CURRENCY
    }
  };
}

function calculateObligasiScore(obligasi) {
  const short_term = parseFloat(obligasi.future_simulation.short.pnl_pct);
  const long_term = parseFloat(obligasi.future_simulation.long.pnl_pct);
  
  if (isNaN(short_term) || isNaN(long_term)) {
    throw new Error(`Invalid obligasi values: short=${short_term}, long=${long_term}`);
  }

  const normalizedShort = normalizeValue(short_term, RANGES.OBLIGASI.min, RANGES.OBLIGASI.max, 'OBLIGASI');
  const normalizedLong = normalizeValue(long_term, RANGES.OBLIGASI.min, RANGES.OBLIGASI.max, 'OBLIGASI');

  return {
    name: 'OBLIGASI',
    short_term: normalizedShort,
    long_term: normalizedLong,
    weight: 0.25,
    metadata: {
      raw_short: short_term,
      raw_long: long_term,
      trend: analyzeTrend(long_term, short_term),
      range: RANGES.OBLIGASI
    }
  };
}

function calculateSahamScore(saham) {
  const pnl = parseFloat(saham.future_info.pnl);
  const margin = parseFloat(saham.future_info.initial_margin);
  
  if (isNaN(pnl) || isNaN(margin) || margin === 0) {
    throw new Error(`Invalid saham values: pnl=${pnl}, margin=${margin}`);
  }

  const returnPct = (pnl / margin) * 100;
  const normalizedValue = normalizeValue(returnPct, RANGES.SAHAM.min, RANGES.SAHAM.max, 'SAHAM');

  return {
    name: 'SAHAM',
    short_term: normalizedValue,
    long_term: normalizedValue,
    weight: 0.25,
    metadata: {
      raw_pnl: pnl,
      raw_margin: margin,
      raw_return_percentage: returnPct,
      trend: returnPct > 0 ? 'IMPROVING' : returnPct < 0 ? 'DECLINING' : 'STABLE',
      range: RANGES.SAHAM
    }
  };
}

module.exports = {
  calculateFinalScore
}; 