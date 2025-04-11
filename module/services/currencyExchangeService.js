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

  // const { timestamp, base, date, rates } = data;
  const { timestamp, source, quotes } = data;

  const result = new CurrencyExchange({ timestamp, source, quotes });
  return await result.save();
}

module.exports = {
  getCurrencyExchange
};