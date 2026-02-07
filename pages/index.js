import { useState, useEffect } from "react";
import Head from "next/head";

var DEFAULT_DATA = {
  AMZN: { name: "Amazon.com", contextType: "EARNINGS SHOCK", marketContext: { market: 40, stock: 60 }, contextNarrative: "AMZN crash is 60% stock-specific (capex shock) and 40% market. AWS +20% ignored as $200B spending terrifies investors.", attribution: [{ factor: "$200B capex guidance", pct: 45, why: "Massive AI spend spooked investors" }, { factor: "Slight EPS miss", pct: 25, why: "Even 2-cent misses punished" }, { factor: "AWS +20% overlooked", pct: -15, why: "Best cloud quarter providing floor" }], signal: { action: "BUY THE PANIC", confidence: 72, reasoning: "AWS +20% phenomenal. Entry $195-210." }, summary: "Crashing on $200B capex shock. AWS crushed it but AI spending fears dominate." },
  GOOGL: { name: "Alphabet Inc", contextType: "POST-EARNINGS", marketContext: { market: 50, stock: 50 }, contextNarrative: "GOOGL is 50/50 market vs stock. Half is hyperscaler capex contagion, half is digesting $175-185B capex.", attribution: [{ factor: "Capex digestion", pct: 45, why: "55% higher than expected" }, { factor: "Cloud +48% overlooked", pct: -25, why: "Best cloud growth ignored" }], signal: { action: "BUY", confidence: 72, reasoning: "Cloud +48% justifies capex. Entry $310-325." }, summary: "Down digesting $175-185B capex guidance. Cloud +48% phenomenal." },
  MSFT: { name: "Microsoft Corp", contextType: "SOFTWARE RECOVERY", marketContext: { market: 60, stock: 40 }, contextNarrative: "MSFT bouncing with software sector. At 25.7x PE, cheapest Mag 7 stock.", attribution: [{ factor: "Software sector bounce", pct: 40, why: "IGV recovering from lows" }, { factor: "Azure growth steady", pct: 30, why: "39% growth reassuring" }], signal: { action: "STRONG BUY", confidence: 78, reasoning: "Best enterprise software at 25.7x PE. Target $480." }, summary: "Recovering from lows. Software being repriced but MSFT has best AI positioning." },
  NVDA: { name: "NVIDIA Corp", contextType: "AI LEADER", marketContext: { market: 55, stock: 45 }, contextNarrative: "NVDA bouncing hard on AI momentum. Blackwell demand strong.", attribution: [{ factor: "AI demand acceleration", pct: 50, why: "Blackwell orders exceeding expectations" }, { factor: "Gaming concerns fading", pct: -20, why: "Datacenter dominates narrative" }], signal: { action: "ACCUMULATE", confidence: 75, reasoning: "Best AI play. Buy $170-185, target $220+." }, summary: "Bouncing on continued AI strength. Feb 25 earnings key catalyst." },
  AAPL: { name: "Apple Inc", contextType: "SAFE HAVEN", marketContext: { market: 30, stock: 70 }, contextNarrative: "AAPL is 70% stock-specific (flight to quality). Apple at 28x with hardware moat.", attribution: [{ factor: "Flight to quality", pct: 45, why: "Stable megacap demand" }, { factor: "No capex overhang", pct: 30, why: "AI via partnerships" }], signal: { action: "HOLD", confidence: 68, reasoning: "Safe haven. Wait for $265-270 to add." }, summary: "Outperforming in volatile market. Flight to quality." },
  TSLA: { name: "Tesla Inc", contextType: "BOUNCE", marketContext: { market: 40, stock: 60 }, contextNarrative: "TSLA bouncing with risk-on sentiment. Still 377x PE.", attribution: [{ factor: "Risk-on bounce", pct: 40, why: "Speculative names rallying" }, { factor: "Sales concerns remain", pct: 30, why: "EU still weak" }], signal: { action: "AVOID", confidence: 55, reasoning: "377x PE for declining sales. Wait for $350." }, summary: "Bouncing but valuation still extreme vs fundamentals." },
  META: { name: "Meta Platforms", contextType: "CAPEX FEARS", marketContext: { market: 50, stock: 50 }, contextNarrative: "META 50/50. Capex concerns vs strong ad business.", attribution: [{ factor: "AI capex concerns", pct: 40, why: "$115-135B guidance" }, { factor: "Ad business strong", pct: -30, why: "Reels gaining share" }], signal: { action: "BUY", confidence: 70, reasoning: "Best ad company. Buy $640-665, target $750." }, summary: "Down from highs on capex but ad fundamentals strong." },
  PLTR: { name: "Palantir Tech", contextType: "HIGH MULTIPLE", marketContext: { market: 40, stock: 60 }, contextNarrative: "PLTR bouncing but still 200x+ PE. Growth strong but priced in.", attribution: [{ factor: "Growth momentum", pct: 40, why: "70% revenue growth" }, { factor: "Extreme valuation", pct: 35, why: "200x+ PE" }], signal: { action: "TRIM", confidence: 58, reasoning: "Take profits on bounces. Re-enter at $100-110." }, summary: "Strong growth but valuation extreme. Trim into strength." },
  QQQ: { name: "Invesco QQQ", contextType: "TECH INDEX", marketContext: { market: 90, stock: 10 }, contextNarrative: "QQQ is 90% market. Tech bouncing from oversold.", attribution: [{ factor: "Oversold bounce", pct: 50, why: "RSI was 24" }, { factor: "Rotation back to growth", pct: 30, why: "Rates stabilizing" }], signal: { action: "HOLD", confidence: 65, reasoning: "Bounce in progress. Hold positions." }, summary: "Tech bouncing from oversold levels." }
};

export default function Dashboard() {
  var priceState = useState({});
  var prices = priceState[0];
  var setPrices = priceState[1];

  var newsState = useState({});
  var news = newsState[0];
  var setNews = newsState[1];

  var watchState = useState(["AMZN","GOOGL","MSFT","NVDA","AAPL","TSLA","META","PLTR","QQQ"]);
  var watchlist = watchState[0];
  var setWatchlist = watchState[1];

  var selState = useState("AMZN");
  var selected = selState[0];
  var setSelected = selState[1];

  var tickState = useState("");
  var newTicker = tickState[0];
  var setNewTicker = tickState[1];

  var loadState = useState(false);
  var loading = loadState[0];
  var setLoading = loadState[1];

  var updateState = useState(null);
  var lastUpdate = updateState[0];
  var setLastUpdate = updateState[1];

  function fetchPrices(tickers) {
    var syms = tickers || watchlist;
    setLoading(true);
    fetch("/api/stocks?symbols=" + syms.join(","))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.stocks) {
          var p = {};
          data.stocks.forEach(function(s) { p[s.symbol] = s; });
          setPrices(p);
          setLastUpdate(new Date());
        }
        setLoading(false);
      })
      .catch(function() { setLoading(false); });
  }

  function fetchNews(symbol) {
    fetch("/api/news?symbol=" + symbol)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.news) {
          setNews(function(prev) {
            var updated = Object.assign({}, prev);
            updated[symbol] = data.news;
            return updated;
          });
        }
      })
      .catch(function() {});
  }

  useEffect(function() { fetchPrices(watchlist); }, [watchlist]);
  useEffect(function() { if (selected) fetchNews(selected); }, [selected]);

  function addTicker() {
    var t = newTicker.toUpperCase().trim();
    if (t && watchlist.indexOf(t) === -1) {
      setWatchlist(watchlist.concat([t]));
      setNewTicker("");
    }
  }

  function removeTicker(t) {
    var newList = watchlist.filter(function(x) { return x !== t; });
    setWatchlist(newList);
    if (selected === t) setSelected(newList[0] || "AMZN");
  }

  function sigColor(a) {
    if (!a) return "#6b7280";
    if (a.indexOf("BUY") > -1 || a.indexOf("ACCUMULATE") > -1) return "#22c55e";
    if (a.indexOf("AVOID") > -1 || a.indexOf("TRIM") > -1) return "#ef4444";
    return "#eab308";
  }

  function fmt(p) { return p ? (p > 1000 ? p.toLocaleString(undefined,{maximumFractionDigits:0}) : p.toFixed(2)) : "0.00"; }
  function timeAgo(ts) { if (!ts) return ""; var diff = Date.now() - ts * 1000; var hrs = Math.floor(diff / 3600000); if (hrs < 1) return "now"; if (hrs < 24) return hrs + "h"; return Math.floor(hrs / 24) + "d"; }

  var info = DEFAULT_DATA[selected] || { name: selected, contextType: "NEW", marketContext: {market:50,stock:50}, contextNarrative: "No analysis yet.", attribution: [], signal: {action:"ANALYZE",confidence:0,reasoning:"Ask Claude to analyze."}, summary: "No data." };
  var pr = prices[selected] || { price: 0, change: 0, changePercent: 0 };
  var liveNews = news[selected] || [];

  return (

    <div>
      <Head><title>Stock Dashboard</title></Head>
      <div style={{minHeight:"100vh",background:"#0f172a",padding:12,fontFamily:"system-ui",color:"white"}}>
        <div style={{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div>
            <h1 style={{fontSize:18,fontWeight:"bold",margin:0}}>Stock Dashboard</h1>
            <div style={{fontSize:10,color:"#64748b"}}>Updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : "--"}</div>
          </div>
          <button onClick={function(){fetchPrices(watchlist);fetchNews(selected);}} disabled={loading} style={{background:"#3b82f6",border:"none",borderRadius:6,padding:"8px 16px",color:"white",fontWeight:"bold",cursor:"pointer",opacity:loading?0.5:1}}>{loading ? "..." : "Refresh"}</button>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <input type="text" value={newTicker} onChange={function(e){setNewTicker(e.target.value.toUpperCase());}} onKeyDown={function(e){if(e.key==="Enter")addTicker();}} placeholder="Add ticker..." style={{flex:1,maxWidth:150,background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"8px 12px",color:"white",fontSize:14}}/>
          <button onClick={addTicker} style={{background:"#22c55e",border:"none",borderRadius:6,padding:"8px 16px",color:"white",fontWeight:"bold",cursor:"pointer"}}>+</button>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:16}}>
          {watchlist.map(function(sym){
            var d=prices[sym]||{price:0,change:0,changePercent:0};
            var isSel=sym===selected;
            var up=d.change>=0;
            return(
              <div key={sym} onClick={function(){setSelected(sym);}} style={{minWidth:130,flexShrink:0,background:isSel?"#1e3a5f":"#1e293b",border:"2px solid "+(isSel?"#22d3ee":"#334155"),borderRadius:8,padding:10,cursor:"pointer",position:"relative"}}>
                <button onClick={function(e){e.stopPropagation();removeTicker(sym);}} style={{position:"absolute",top:2,right:4,background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:12}}>X</button>
                <div style={{fontWeight:"bold",fontSize:14}}>{sym}</div>
                <div style={{fontWeight:"bold",fontSize:16}}>${fmt(d.price)}</div>
                <div style={{fontSize:12,color:up?"#22c55e":"#ef4444"}}>{up?"+":""}{fmt(d.change)} ({up?"+":""}{d.changePercent?d.changePercent.toFixed(2):"0"}%)</div>
              </div>
            );
          })}
        </div>
        <div style={{background:"#1e293b",borderRadius:12,padding:16,border:"1px solid #334155"}}>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:16}}>
            <div>
              <h2 style={{fontSize:24,fontWeight:"bold",margin:0}}>{selected}</h2>
              <div style={{fontSize:12,color:"#94a3b8"}}>{info.name}</div>
              <span style={{fontSize:10,background:"#334155",padding:"2px 8px",borderRadius:4}}>{info.contextType}</span>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:28,fontWeight:"bold"}}>${fmt(pr.price)}</div>
              <div style={{fontSize:16,color:pr.change>=0?"#22c55e":"#ef4444"}}>{pr.change>=0?"+":""}{fmt(pr.change)} ({pr.changePercent>=0?"+":""}{pr.changePercent?pr.changePercent.toFixed(2):"0"}%)</div>
            </div>
          </div>
          <div style={{background:"#111827",borderRadius:8,padding:12,marginBottom:12,borderLeft:"4px solid "+sigColor(info.signal.action)}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div><div style={{fontSize:9,color:"#9ca3af"}}>SIGNAL</div><div style={{color:sigColor(info.signal.action),fontWeight:700,fontSize:15}}>{info.signal.action}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#9ca3af"}}>CONFIDENCE</div><div style={{fontWeight:700,fontSize:16}}>{info.signal.confidence}%</div></div>
            </div>
            <div style={{fontSize:12,color:"#d1d5db"}}>{info.signal.reasoning}</div>
          </div>
          <div style={{background:"#111827",borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{fontSize:11,color:"#9ca3af",marginBottom:8}}>MARKET vs STOCK</div>
            <div style={{display:"flex",height:8,borderRadius:4,overflow:"hidden",marginBottom:6}}><div style={{width:info.marketContext.market+"%",background:"#3b82f6"}}></div><div style={{width:info.marketContext.stock+"%",background:"#f59e0b"}}></div></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:8}}><span style={{color:"#3b82f6"}}>Market: {info.marketContext.market}%</span><span style={{color:"#f59e0b"}}>Stock: {info.marketContext.stock}%</span></div>
            <div style={{fontSize:11,color:"#94a3b8"}}>{info.contextNarrative}</div>
          </div>
          {info.attribution.length>0&&<div style={{marginBottom:12}}><div style={{fontSize:11,color:"#9ca3af",marginBottom:8}}>WHY ITS MOVING</div>{info.attribution.map(function(a,i){return(<div key={i} style={{background:"#111827",borderRadius:6,padding:8,marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontWeight:600,fontSize:11}}>{a.factor}</span><span style={{background:a.pct>0?"#7f1d1d":"#14532d",color:a.pct>0?"#fca5a5":"#86efac",padding:"1px 6px",borderRadius:4,fontSize:10,fontWeight:600}}>{a.pct>0?"+":""}{a.pct}%</span></div><div style={{fontSize:10,color:"#9ca3af"}}>{a.why}</div></div>);})}</div>}
          <div style={{background:"#111827",borderRadius:8,padding:10,marginBottom:12}}><div style={{fontSize:10,color:"#9ca3af",marginBottom:4}}>SUMMARY</div><div style={{fontSize:12,color:"#d1d5db"}}>{info.summary}</div></div>
          <div><div style={{fontSize:11,color:"#9ca3af",marginBottom:8}}>LIVE NEWS</div>{liveNews.length>0?liveNews.map(function(n,i){return(<div key={i} style={{background:i%2===0?"#111827":"transparent",borderRadius:6,padding:10,marginBottom:4}}><div style={{fontSize:12,fontWeight:600,marginBottom:4}}>{n.headline}</div><div style={{fontSize:10,color:"#94a3b8",marginBottom:4}}>{n.summary?n.summary.substring(0,120)+"...":""}</div><div style={{fontSize:9,color:"#6b7280"}}><a href={n.url} target="_blank" rel="noopener noreferrer" style={{color:"#22d3ee",textDecoration:"none"}}>{n.source}</a> | {timeAgo(n.time)}</div></div>);}):(<div style={{fontSize:11,color:"#64748b",padding:10}}>Loading news...</div>)}</div>
        </div>
        <div style={{textAlign:"center",marginTop:12,fontSize:9,color:"#475569"}}>Not financial advice | Prices and news from Finnhub</div>
      </div>
    </div>
  );
}

                        
