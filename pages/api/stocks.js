export default async function handler(req, res) {
  var API_KEY = "YOUR_FINNHUB_KEY_HERE";
  var defaultSymbols = ["AMZN","GOOGL","MSFT","NVDA","AAPL","TSLA","META","PLTR","QQQ"];
  var query = req.query.symbols;
  var symbols = query ? query.split(",") : defaultSymbols;
  var stocks = [];
  
  try {
    for (var i = 0; i < symbols.length; i++) {
      var sym = symbols[i].toUpperCase().trim();
      var r = await fetch("https://finnhub.io/api/v1/quote?symbol=" + sym + "&token=" + API_KEY);
      var d = await r.json();
      if (d.c) {
        stocks.push({
          symbol: sym,
          price: d.c,
          change: d.d,
          changePercent: d.dp,
          high: d.h,
          low: d.l,
          open: d.o,
          prevClose: d.pc,
          timestamp: d.t
        });
      }
    }
    res.status(200).json({ stocks: stocks, updated: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: "Failed", message: e.message });
  }
}
