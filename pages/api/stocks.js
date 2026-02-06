export default async function handler(req, res) {
  var symbols = ["AMZN","GOOGL","MSFT","NVDA","AAPL","TSLA","META","PLTR","QQQ"];
  
  try {
    var url = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/" + symbols[0] + "?modules=price";
    var stocks = [];
    
    for (var i = 0; i < symbols.length; i++) {
      var sym = symbols[i];
      var r = await fetch("https://query2.finance.yahoo.com/v10/finance/quoteSummary/" + sym + "?modules=price", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      var d = await r.json();
      if (d.quoteSummary && d.quoteSummary.result) {
        var p = d.quoteSummary.result[0].price;
        stocks.push({
          symbol: sym,
          price: p.regularMarketPrice ? p.regularMarketPrice.raw : 0,
          change: p.regularMarketChange ? p.regularMarketChange.raw : 0,
          changePercent: p.regularMarketChangePercent ? p.regularMarketChangePercent.raw * 100 : 0
        });
      }
    }
    
    res.status(200).json({ stocks: stocks, updated: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: "Failed", message: e.message });
  }
}
