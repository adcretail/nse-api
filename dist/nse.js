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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NseIndia = void 0;
const axios_1 = __importDefault(require("axios"));
const user_agents_1 = __importDefault(require("user-agents"));
const utils_1 = require("./utils");
class NseIndia {
    constructor() {
        this.baseUrl = 'https://www.nseindia.com';
        this.cookies = '';
        this.userAgent = '';
        this.cookieUsedCount = 0;
        this.cookieMaxAge = 60;
        this.cookieExpiry = new Date().getTime() + (this.cookieMaxAge * 1000);
        this.noOfConnections = 0;
        this.baseHeaders = {
            'Authority': 'www.nseindia.com',
            'Referer': 'https://www.nseindia.com/',
            'Accept': '*/*',
            'Origin': this.baseUrl,
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Ch-Ua': '" Not A;Brand";v="99", "Chromium";v="109", "Google Chrome";v="109"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        };
    }
    getNseCookies() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cookies === '' || this.cookieUsedCount > 10 || this.cookieExpiry <= new Date().getTime()) {
                this.userAgent = new user_agents_1.default().toString();
                // Make the request to get the response
                const response = yield axios_1.default.get(this.baseUrl, {
                    headers: Object.assign(Object.assign({}, this.baseHeaders), { 'User-Agent': this.userAgent })
                });
                // Extract 'set-cookie' header
                const setCookies = response.headers['set-cookie'];
                const cookies = [];
                // Check if setCookies is defined before proceeding
                if (setCookies && Array.isArray(setCookies)) {
                    setCookies.forEach((cookie) => {
                        const requiredCookies = ['nsit', 'nseappid', 'ak_bmsc', 'AKA_A2', 'bm_mi', 'bm_sv'];
                        const cookieKeyValue = cookie.split(';')[0];
                        const cookieEntry = cookieKeyValue.split('=');
                        // Only add the cookie if it matches one of the required ones
                        if (requiredCookies.includes(cookieEntry[0])) {
                            cookies.push(cookieKeyValue);
                        }
                    });
                }
                // Update cookies, usage count, and expiry time
                this.cookies = cookies.join('; ');
                this.cookieUsedCount = 0;
                this.cookieExpiry = new Date().getTime() + (this.cookieMaxAge * 1000);
            }
            this.cookieUsedCount++;
            return this.cookies;
        });
    }
    getData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let retries = 0;
            let hasError = false;
            do {
                while (this.noOfConnections >= 5) {
                    yield (0, utils_1.sleep)(500);
                }
                this.noOfConnections++;
                try {
                    const response = yield axios_1.default.get(url, {
                        headers: Object.assign(Object.assign({}, this.baseHeaders), { 'Cookie': yield this.getNseCookies(), 'User-Agent': this.userAgent })
                    });
                    this.noOfConnections--;
                    return response.data;
                }
                catch (error) {
                    hasError = true;
                    retries++;
                    this.noOfConnections--;
                    if (retries >= 10)
                        throw error;
                }
            } while (hasError);
        });
    }
    getDataByEndpoint(apiEndpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getData(`${this.baseUrl}${apiEndpoint}`);
        });
    }
    getAllStockSymbols() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.getDataByEndpoint('/api/market-data-pre-open?key=ALL');
            return data.map((obj) => obj.metadata.symbol).sort();
        });
    }
    getEquityDetails(symbol) {
        return this.getDataByEndpoint(`/api/quote-equity?symbol=${encodeURIComponent(symbol.toUpperCase())}`);
    }
    getEquityTradeInfo(symbol) {
        return this.getDataByEndpoint(`/api/quote-equity?symbol=${encodeURIComponent(symbol.toUpperCase())}&section=trade_info`);
    }
    getEquityCorporateInfo(symbol) {
        return this.getDataByEndpoint(`/api/top-corp-info?symbol=${encodeURIComponent(symbol.toUpperCase())}&market=equities`);
    }
    getEquityIntradayData(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = yield this.getEquityDetails(symbol.toUpperCase());
            const identifier = details.info.identifier;
            return this.getDataByEndpoint(`/api/chart-databyindex?index=${identifier}`);
        });
    }
    getEquityHistoricalData(symbol, range) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getEquityDetails(symbol.toUpperCase());
            const activeSeries = data.info.activeSeries.length ? data.info.activeSeries[0] : 'EQ';
            if (!range) {
                range = { start: new Date(data.metadata.listingDate), end: new Date() };
            }
            const dateRanges = (0, utils_1.getDateRangeChunks)(range.start, range.end, 66);
            const promises = dateRanges.map((dateRange) => __awaiter(this, void 0, void 0, function* () {
                const url = `/api/historical/cm/equity?symbol=${encodeURIComponent(symbol.toUpperCase())}&series=["${activeSeries}"]&from=${dateRange.start}&to=${dateRange.end}`;
                return this.getDataByEndpoint(url);
            }));
            return Promise.all(promises);
        });
    }
    getEquityOptionChain(symbol) {
        return this.getDataByEndpoint(`/api/option-chain-equities?symbol=${encodeURIComponent(symbol.toUpperCase())}`);
    }
}
exports.NseIndia = NseIndia;
