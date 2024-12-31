const express = require("express");
const cors = require("cors");
const NseIndia = require("./nse");
const { sleep } = require("./utils");

const app = express();
const nse = new NseIndia();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// To parse incoming JSON request body
app.use(express.json());

// Endpoint to fetch all stock symbols
app.get("/symbols", async (req, res) => {
  try {
    const symbols = await nse.getAllStockSymbols();
    res.json({ symbols });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stock symbols" });
  }
});

// Endpoint to fetch equity details based on symbol
app.get("/equity-details", async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Stock symbol is required" });
  }

  try {
    const equityDetails = await nse.getEquityDetails(symbol);
    const tradeInfo = await nse.getEquityTradeInfo(symbol);
    const corporateInfo = await nse.getEquityCorporateInfo(symbol);
    const intradayData = await nse.getEquityIntradayData(symbol); 
    res.json({
      equityDetails,
      tradeInfo,
      corporateInfo,
      intradayData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Failed to fetch data for symbol: ${symbol}` });
  }
});

// Endpoint to fetch Index Intraday Data
app.get("/index-intraday", async (req, res) => {
  const { index, isPreOpenData } = req.query;
  if (!index) return res.status(400).json({ error: "Index name is required" });

  try {
    const intradayData = await nse.getIndexIntradayData(index, isPreOpenData === "true");
    res.json({ intradayData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch index intraday data" });
  }
});

// Endpoint to fetch Index Option Chain
app.get("/index-option-chain", async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Index symbol is required" });
  }

  try {
    const optionChainData = await nse.getIndexOptionChain(symbol);
    res.json({ optionChainData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Failed to fetch option chain for symbol: ${symbol}` });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
