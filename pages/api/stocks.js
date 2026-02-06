export default async function handler(req, res) {
  var API_KEY = "d6314vhr01qnpqnvdimgd6314vhr01qnpqnvdin0";
  var symbols = ["AMZN","GOOGL","MSFT","NVDA","AAPL","TSLA","META","PLTR","QQQ"];
  var stocks = [];
  
  try {
    for (var i = 0; i < symbols.length; i++) {
      var sym = symbols[i];
      var r = await fetch("https://finnhub.io/api/v1/quote?symbol=" + sym + "&token=" + API_KEY);
      var d = await r.json();
      if (d.c) {
        stocks.push({
          symbol: sym,
          price: d.c,
          change: d.d,
          changePercent: d.dp
        });
      }
    }
    res.status(200).json({ stocks: stocks, updated: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: "Failed", message: e.message });
  }
}
