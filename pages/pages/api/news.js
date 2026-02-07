export default async function handler(req, res) {
  var API_KEY = "d637n2hr01qnpqg04s20d637n2hr01qnpqg04s2g";
  var symbol = req.query.symbol || "AAPL";
  
  try {
    var today = new Date();
    var week = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    var from = week.toISOString().split("T")[0];
    var to = today.toISOString().split("T")[0];
    
    var r = await fetch("https://finnhub.io/api/v1/company-news?symbol=" + symbol + "&from=" + from + "&to=" + to + "&token=" + API_KEY);
    var data = await r.json();
    
    var news = data.slice(0, 5).map(function(n) {
      return {
        headline: n.headline,
        source: n.source,
        url: n.url,
        time: n.datetime,
        summary: n.summary
      };
    });
    
    res.status(200).json({ symbol: symbol, news: news });
  } catch (e) {
    res.status(500).json({ error: "Failed", message: e.message });
  }
}
