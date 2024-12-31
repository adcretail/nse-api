"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nse_1 = require("./nse");
const utils_1 = require("./utils");
const nse = new nse_1.NseIndia();
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Fetching NSE stock symbols...');
        const symbols = yield nse.getAllStockSymbols();
        console.log('Stock Symbols:', symbols);
        const symbol = symbols[0]; // Pick first stock symbol for demonstration
        console.log(`Fetching details for symbol: ${symbol}`);
        const equityDetails = yield nse.getEquityDetails(symbol);
        console.log('Equity Details:', equityDetails);
        const tradeInfo = yield nse.getEquityTradeInfo(symbol);
        console.log('Equity Trade Info:', tradeInfo);
        const corporateInfo = yield nse.getEquityCorporateInfo(symbol);
        console.log('Equity Corporate Info:', corporateInfo);
        const intradayData = yield nse.getEquityIntradayData(symbol);
        console.log('Intraday Data:', intradayData);
        const historicalData = yield nse.getEquityHistoricalData(symbol);
        console.log('Historical Data:', historicalData);
        const optionChainData = yield nse.getEquityOptionChain(symbol);
        console.log('Option Chain Data:', optionChainData);
        console.log(`Data extraction for ${symbol} completed.`);
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        console.log('Waiting for 10 seconds before retry...');
        yield (0, utils_1.sleep)(10000); // Wait for 10 seconds
    }
});
// Continuous run
(() => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        yield run();
    }
}))();
