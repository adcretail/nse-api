const axios = require("axios");
const UserAgent = require("user-agents");
const { getDateRangeChunks, sleep } = require("./utils");

class NseIndia {
  constructor() {
    this.baseUrl = "https://www.nseindia.com";
    this.cookies = "";
    this.userAgent = "";
    this.cookieUsedCount = 0;
    this.cookieMaxAge = 60;
    this.cookieExpiry = new Date().getTime() + this.cookieMaxAge * 1000;
    this.noOfConnections = 0;
    this.baseHeaders = {
      Authority: "www.nseindia.com",
      Referer: "https://www.nseindia.com/",
      Accept: "*/*",
      Origin: this.baseUrl,
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Sec-Ch-Ua":
        '" Not A;Brand";v="99", "Chromium";v="109", "Google Chrome";v="109"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    };
  }

  async getNseCookies() {
    if (
      this.cookies === "" ||
      this.cookieUsedCount > 10 ||
      this.cookieExpiry <= new Date().getTime()
    ) {
      this.userAgent = new UserAgent().toString();
      const response = await axios.get(this.baseUrl, {
        headers: { ...this.baseHeaders, "User-Agent": this.userAgent },
      });
      const setCookies = response.headers["set-cookie"];
      const cookies = [];
      setCookies.forEach((cookie) => {
        const requiredCookies = [
          "nsit",
          "nseappid",
          "ak_bmsc",
          "AKA_A2",
          "bm_mi",
          "bm_sv",
        ];
        const cookieKeyValue = cookie.split(";")[0];
        const cookieEntry = cookieKeyValue.split("=");
        if (requiredCookies.includes(cookieEntry[0])) {
          cookies.push(cookieKeyValue);
        }
      });
      this.cookies = cookies.join("; ");
      this.cookieUsedCount = 0;
      this.cookieExpiry = new Date().getTime() + this.cookieMaxAge * 1000;
    }
    this.cookieUsedCount++;
    return this.cookies;
  }

  async getData(url) {
    let retries = 0;
    let hasError = false;
    do {
      while (this.noOfConnections >= 5) {
        await sleep(500);
      }
      this.noOfConnections++;
      try {
        const response = await axios.get(url, {
          headers: {
            ...this.baseHeaders,
            Cookie: await this.getNseCookies(),
            "User-Agent": this.userAgent,
          },
        });
        this.noOfConnections--;
        return response.data;
      } catch (error) {
        hasError = true;
        retries++;
        this.noOfConnections--;
        if (retries >= 10) throw error;
      }
    } while (hasError);
  }

  async getDataByEndpoint(apiEndpoint) {
    return this.getData(`${this.baseUrl}${apiEndpoint}`);
  }

  async getAllStockSymbols() {
    try {
      const { data } = await this.getDataByEndpoint(
        "/api/market-data-pre-open?key=ALL"
      );

      // Check if data is defined and is an array
      if (!data || !Array.isArray(data)) {
        throw new Error(
          "Unexpected API response: 'data' is undefined or not an array."
        );
      }

      // Check if data contains the metadata and symbol fields
      return data
        .filter((obj) => obj.metadata && obj.metadata.symbol) // Ensure metadata and symbol exist
        .map((obj) => obj.metadata.symbol)
        .sort();
    } catch (error) {
      console.error("Failed to fetch stock symbols:", error);
      throw error; // Re-throw the error to be handled in the calling function
    }
  }

  getEquityDetails(symbol) {
    return this.getDataByEndpoint(
      `/api/quote-equity?symbol=${encodeURIComponent(symbol.toUpperCase())}`
    );
  }

  getEquityTradeInfo(symbol) {
    return this.getDataByEndpoint(
      `/api/quote-equity?symbol=${encodeURIComponent(
        symbol.toUpperCase()
      )}&section=trade_info`
    );
  }

  getEquityCorporateInfo(symbol) {
    return this.getDataByEndpoint(
      `/api/top-corp-info?symbol=${encodeURIComponent(
        symbol.toUpperCase()
      )}&market=equities`
    );
  }

  async getEquityIntradayData(symbol) {
    const details = await this.getEquityDetails(symbol.toUpperCase());
    const identifier = details.info.identifier;
    return this.getDataByEndpoint(`/api/chart-databyindex?index=${identifier}`);
  }

  async getIndexIntradayData(index, isPreOpenData = false) {
    const endpoint = isPreOpenData
      ? `/api/market-data-pre-open?key=${encodeURIComponent(index)}`
      : `/api/chart-databyindex?index=${encodeURIComponent(index)}`;
    return this.getDataByEndpoint(endpoint);
  }

  // Fetch index option chain data
  getIndexOptionChain(indexSymbol) {
    return this.getDataByEndpoint(
      `/api/option-chain-indices?symbol=${encodeURIComponent(
        indexSymbol.toUpperCase()
      )}`
    );
  }
}

module.exports = NseIndia;
