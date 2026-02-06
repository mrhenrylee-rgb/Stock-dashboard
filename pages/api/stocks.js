export default async function handler(req, res) {
  var symbols = ["AMZN","GOOGL","MSFT","NVDA","AAPL","TSLA","META","PLTR","QQQ"];
  var url = "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" + symbols.join(",");
  
  try {
    var response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    var data = await response.json();
    var stocks = data.quoteResponse.result.map(function(q) {
      return {
        symbol: q.symbol,
        price: q.regularMarketPrice || 0,
        change: q.regularMarketChange || 0,
        changePercent: q.regularMarketChangePercent || 0,
        afterHoursPrice: q.postMarketPrice || null,
        afterHoursChange: q.postMarketChange || null,
        afterHoursPercent: q.postMarketChangePercent || null,
        marketTime: q.regularMarketTime || null
      };
    });
    res.status(200).json({ stocks: stocks, updated: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch", message: e.message });
  }
}
