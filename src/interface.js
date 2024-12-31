// Define constants for data shapes

/**
 * Date range object
 * @typedef {Object} DateRange
 * @property {Date} start - Start date
 * @property {Date} end - End date
 */
const DateRange = {
  start: Date,
  end: Date,
};

/**
 * Equity details object
 * @typedef {Object} EquityDetails
 * @property {Object} info - Equity info
 * @property {string} info.symbol - Equity symbol
 * @property {string[]} info.activeSeries - Active series
 * @property {string} info.identifier - Equity identifier
 * @property {Object} metadata - Equity metadata
 * @property {string} metadata.listingDate - Listing date
 */
const EquityDetails = {
  info: {
    symbol: String,
    activeSeries: [String],
    identifier: String,
  },
  metadata: {
    listingDate: String,
  },
};

/**
 * Intraday data object
 * @typedef {Object} IntradayData
 * @property {string} identifier - Unique identifier for the equity
 * @property {string} name - Name of the equity
 * @property {number[][]} graphtData - Array of timestamp and price pairs
 * @property {number} closePrice - Closing price of the equity
 */
const IntradayData = {
  identifier: String,
  name: String,
  graphtData: [[Number, Number]],
  closePrice: Number,
};


/**
 * Equity trade info object
 * @typedef {Object} EquityTradeInfo
 * @property {Object} tradeInfo - Trade info
 * @property {number} tradeInfo.lastPrice - Last price
 * @property {number} tradeInfo.totalTradedVolume - Total traded volume
 */
const EquityTradeInfo = {
  tradeInfo: {
    lastPrice: Number,
    totalTradedVolume: Number,
  },
};

/**
 * Equity corporate info object
 * @typedef {Object} EquityCorporateInfo
 * @property {Object} corporate - Corporate info
 * @property {string[]} corporate.announcements - Announcements
 */
const EquityCorporateInfo = {
  corporate: {
    announcements: [String],
  },
};


/**
 * Index historical data object
 * @typedef {Object} IndexHistoricalData
 * @property {Object[]} data - Historical records for an index
 * @property {string} data[].EOD_TIMESTAMP - End of day timestamp
 * @property {number} data[].EOD_OPEN_INDEX_VAL - Open index value
 * @property {number} data[].EOD_HIGH_INDEX_VAL - High index value
 * @property {number} data[].EOD_LOW_INDEX_VAL - Low index value
 * @property {number} data[].EOD_CLOSE_INDEX_VAL - Close index value
 */

/**
 * Index intraday data object
 * @typedef {Object} IndexIntradayData
 * @property {Object[]} records - Array of intraday index records
 * @property {string} records[].time - Timestamp
 * @property {number} records[].value - Value at the timestamp
 */


/**
 * Equity stock indices data
 * @typedef {Object} EquityStockIndices
 * @property {string} name - Index name
 * @property {Object} metadata - Metadata for the index
 * @property {number} metadata.high - Day high
 * @property {number} metadata.low - Day low
 * @property {number} metadata.previousClose - Previous close
 * @property {Object[]} data - Array of stock data within the index
 * @property {string} data[].symbol - Stock symbol
 * @property {number} data[].lastPrice - Last traded price
 */

/**
 * Option chain data object
 * @typedef {Object} OptionChainData
 * @property {Object} records - Option chain records
 * @property {string[]} records.expiryDates - Array of expiry dates
 * @property {Object[]} records.data - Strike price-wise data
 * @property {number} records.underlyingValue - Underlying asset value
 */

/**
 * Equity historical data object
 * @typedef {Object} EquityHistoricalInfo
 * @property {string} _id - Unique identifier
 * @property {string} CH_SYMBOL - Stock symbol
 * @property {string} CH_SERIES - Series of the stock
 * @property {string} CH_MARKET_TYPE - Market type
 * @property {number} CH_TRADE_HIGH_PRICE - Highest trade price
 * @property {number} CH_TRADE_LOW_PRICE - Lowest trade price
 * @property {number} CH_OPENING_PRICE - Opening price
 * @property {number} CH_CLOSING_PRICE - Closing price
 * @property {number} CH_LAST_TRADED_PRICE - Last traded price
 * @property {number} CH_PREVIOUS_CLS_PRICE - Previous close price
 * @property {number} CH_TOT_TRADED_QTY - Total traded quantity
 * @property {number} CH_TOT_TRADED_VAL - Total traded value
 * @property {number} CH_52WEEK_HIGH_PRICE - 52-week high price
 * @property {number} CH_52WEEK_LOW_PRICE - 52-week low price
 * @property {number | null} CH_TOTAL_TRADES - Total trades, can be null
 * @property {string} CH_ISIN - ISIN (International Securities Identification Number)
 * @property {string} CH_TIMESTAMP - Timestamp of the data
 * @property {string} TIMESTAMP - General timestamp
 * @property {string} createdAt - Creation date
 * @property {string} updatedAt - Last update date
 * @property {number} __v - Version key
 * @property {number} VWAP - Volume-weighted average price
 * @property {string} mTIMESTAMP - Modified timestamp
 */

/**
 * Equity historical data object
 * @typedef {Object} EquityHistoricalData
 * @property {Object[]} data - Array of equity historical info objects
 * @property {string} data._id - Unique identifier
 * @property {string} data.CH_SYMBOL - Stock symbol
 * @property {string} data.CH_SERIES - Series of the stock
 * @property {string} data.CH_MARKET_TYPE - Market type
 * @property {number} data.CH_TRADE_HIGH_PRICE - Highest trade price
 * @property {number} data.CH_TRADE_LOW_PRICE - Lowest trade price
 * @property {number} data.CH_OPENING_PRICE - Opening price
 * @property {number} data.CH_CLOSING_PRICE - Closing price
 * @property {number} data.CH_LAST_TRADED_PRICE - Last traded price
 * @property {number} data.CH_PREVIOUS_CLS_PRICE - Previous close price
 * @property {number} data.CH_TOT_TRADED_QTY - Total traded quantity
 * @property {number} data.CH_TOT_TRADED_VAL - Total traded value
 * @property {number} data.CH_52WEEK_HIGH_PRICE - 52-week high price
 * @property {number} data.CH_52WEEK_LOW_PRICE - 52-week low price
 * @property {number | null} data.CH_TOTAL_TRADES - Total trades, can be null
 * @property {string} data.CH_ISIN - ISIN (International Securities Identification Number)
 * @property {string} data.CH_TIMESTAMP - Timestamp of the data
 * @property {string} data.TIMESTAMP - General timestamp
 * @property {string} data.createdAt - Creation date
 * @property {string} data.updatedAt - Last update date
 * @property {number} data.__v - Version key
 * @property {number} data.VWAP - Volume-weighted average price
 * @property {string} data.mTIMESTAMP - Modified timestamp
 * @property {Object} meta - Metadata for the historical data
 * @property {string[]} meta.series - Array of series strings
 * @property {string} meta.fromDate - Start date of the data
 * @property {string} meta.toDate - End date of the data
 * @property {string[]} meta.symbols - Array of symbols
 */
const EquityHistoricalData = {
  data: [
    {
      _id: String,
      CH_SYMBOL: String,
      CH_SERIES: String,
      CH_MARKET_TYPE: String,
      CH_TRADE_HIGH_PRICE: Number,
      CH_TRADE_LOW_PRICE: Number,
      CH_OPENING_PRICE: Number,
      CH_CLOSING_PRICE: Number,
      CH_LAST_TRADED_PRICE: Number,
      CH_PREVIOUS_CLS_PRICE: Number,
      CH_TOT_TRADED_QTY: Number,
      CH_TOT_TRADED_VAL: Number,
      CH_52WEEK_HIGH_PRICE: Number,
      CH_52WEEK_LOW_PRICE: Number,
      CH_TOTAL_TRADES: Number,
      CH_ISIN: String,
      CH_TIMESTAMP: String,
      TIMESTAMP: String,
      createdAt: String,
      updatedAt: String,
      __v: Number,
      VWAP: Number,
      mTIMESTAMP: String,
    },
  ],
  meta: {
    series: [String],
    fromDate: String,
    toDate: String,
    symbols: [String],
  },
};

module.exports = {
  DateRange,
  EquityDetails,
  EquityTradeInfo,
  EquityCorporateInfo,
  EquityHistoricalData,
  IndexHistoricalData,
  IndexIntradayData,
  OptionChainData,
  EquityStockIndices,
};