const CurrencyExchange = require("../models/CurrencyExchange");
const global_config = require("../../bin/helper/global_config");
const axios = require("axios");
const logger = require('../../bin/helper/logger');

async function getCurrencyExchange() {
  const ctx = 'currency-exchange-service';
  const access_key = global_config.get("/currencyExchangeApi/access_key");
  const url = global_config.get("/currencyExchangeApi/url");

  const { data } = await axios.get(url, {
    params: {
      access_key: access_key,
      base: "USD",
      currencies: "USD,IDR",
    }
  });

  if (!data.success) {
    logger.log(ctx, `Failed to fetch currency exchange data. ${data}`, 'fetch currentcy exchange');
    throw new Error("Failed to fetch currency exchange data.");
  }

  const { timestamp, source, quotes } = data;
  const usdidr = quotes.USDIDR;
  const short = usdidr;

  const previousExchanges = await CurrencyExchange.find({
    short: { $exists: true, $ne: null }
  }).sort({ timestamp: -1 }).limit(4);

  // Filter hanya short yang berupa number valid
  const validShorts = previousExchanges
    .map(item => item.short)
    .filter(val => typeof val === 'number' && !isNaN(val));

  let long;

  if (validShorts.length > 0) {
    const sumShort = validShorts.reduce((acc, val) => acc + val, 0);
    long = (sumShort + short) / (validShorts.length + 1);
  } else {
    long = short;
  }


  const result = new CurrencyExchange({ timestamp, source, quotes, short, long });
  return await result.save();
}

module.exports = {
  getCurrencyExchange
};