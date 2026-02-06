import { useState, useEffect } from ‘react’;
import Head from ‘next/head’;

// Stock Dashboard - Feb 5, 2026
// Features: Add/Remove Tickers, Timestamps, Market Hours Refresh, News Attribution

const DEFAULT_STOCKS = {
AMZN: {
name: ‘Amazon.com’,
regularPrice: 229.15, regularChange: -3.53, regularPct: -1.52, regularTime: ‘4:00 PM’,
afterPrice: 200.02, afterChange: -29.13, afterPct: -12.71, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 40, stock: 60 },
contextType: ‘EARNINGS SHOCK’,
contextNarrative: ‘AMZN crash is 60% stock-specific (capex shock) and 40% market (Big Tech capex fears spreading). AWS +20% ignored as $200B spending terrifies investors questioning AI ROI.’,
attribution: [
{ factor: ‘$200B capex guidance (60% above 2025)’, pct: 45, why: ‘Massive AI infrastructure spend spooked investors on ROI timeline’ },
{ factor: ‘Slight EPS miss ($1.95 vs $1.97)’, pct: 25, why: ‘Even 2-cent misses punished at these valuations’ },
{ factor: ‘AWS +20% growth overlooked’, pct: -15, why: ‘Best cloud quarter providing floor to selling’ },
{ factor: ‘Sector contagion from GOOGL/MSFT’, pct: 10, why: ‘All hyperscalers getting capex haircut’ }
],
signal: { action: ‘BUY THE PANIC’, confidence: 72, reasoning: ‘-12% after-hours on slight miss is panic. AWS +20% is phenomenal. Entry $195-205, target $250.’ },
summary: ‘Crashing after-hours on $200B capex shock—higher than GOOGL ($180B) and META ($135B). AWS crushed it but AI spending fears dominate.’,
news: [
{ headline: ‘CRASHES 12% after-hours on $200B capex guidance shock’, source: ‘CNBC’, url: ‘https://cnbc.com’, age: ‘30m’, weight: 100, sent: ‘neg’ },
{ headline: ‘Q4 EPS $1.95 misses $1.97 estimate’, source: ‘Reuters’, url: ‘https://reuters.com’, age: ‘1h’, weight: 95, sent: ‘neg’ },
{ headline: ‘AWS $35.58B beats, +20.2% YoY’, source: ‘TechCrunch’, url: ‘https://techcrunch.com’, age: ‘1h’, weight: 85, sent: ‘pos’ }
]
},
GOOGL: {
name: ‘Alphabet Inc’,
regularPrice: 318.55, regularChange: -14.49, regularPct: -4.35, regularTime: ‘4:00 PM’,
afterPrice: 318.00, afterChange: -0.55, afterPct: -0.17, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 50, stock: 50 },
contextType: ‘POST-EARNINGS’,
contextNarrative: ‘GOOGL is 50/50 market vs stock. Half is hyperscaler capex contagion (MSFT, AMZN fears spreading), half is digesting $175-185B capex guidance. Cloud +48% being completely overlooked.’,
attribution: [
{ factor: ‘Capex digestion ($175-185B vs $119B est)’, pct: 45, why: ‘55% higher than expected—AI spending fears across sector’ },
{ factor: ‘Cloud +48% being overlooked’, pct: -25, why: ‘Best cloud growth in industry ignored amid panic’ },
{ factor: ‘Hyperscaler contagion’, pct: 15, why: ‘MSFT -28%, AMZN -14% dragging sentiment’ },
{ factor: ‘Analyst upgrades providing floor’, pct: -10, why: ‘Scotiabank $400 target, multiple Buy ratings’ }
],
signal: { action: ‘BUY’, confidence: 72, reasoning: ‘Cloud +48% justifies capex. Entry $310-325, target $400.’ },
summary: ‘Down 4% digesting $175-185B capex guidance. Cloud +48% is phenomenal but overshadowed by spending fears.’,
news: [
{ headline: ‘$175-185B capex shocked market—55% above estimates’, source: ‘Bloomberg’, url: ‘https://bloomberg.com’, age: ‘1d’, weight: 95, sent: ‘neg’ },
{ headline: ‘Cloud revenue +48% YoY—best in class’, source: ‘CNBC’, url: ‘https://cnbc.com’, age: ‘1d’, weight: 90, sent: ‘pos’ },
{ headline: ‘Scotiabank raises target to $400’, source: ‘TipRanks’, url: ‘https://tipranks.com’, age: ‘1d’, weight: 75, sent: ‘pos’ }
]
},
MSFT: {
name: ‘Microsoft Corp’,
regularPrice: 393.67, regularChange: -20.12, regularPct: -4.86, regularTime: ‘4:00 PM’,
afterPrice: 392.50, afterChange: -1.17, afterPct: -0.30, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 60, stock: 40 },
contextType: ‘SOFTWARE MASSACRE’,
contextNarrative: ‘MSFT is 60% market context (software sector down 28%, AI disruption fears) and 40% stock-specific (Azure decel, capex concerns). Irony: at 25.7x P/E, MSFT is CHEAPER than S&P average but treated like bloated SaaS.’,
attribution: [
{ factor: ‘Software sector massacre (-28% from highs)’, pct: 35, why: ‘IGV ETF crushed as AI threatens SaaS model’ },
{ factor: ‘Post-earnings selloff extends’, pct: 30, why: ‘-9.8% on earnings, now -3% more today’ },
{ factor: ‘$37.5B quarterly AI capex’, pct: 20, why: ‘Investors questioning ROI on massive spending’ },
{ factor: ‘Azure 39% growth “disappointed”’, pct: 10, why: ‘Even 39% growth not enough for expectations’ }
],
signal: { action: ‘STRONG BUY’, confidence: 78, reasoning: ‘Best enterprise software at 25.7x P/E—cheapest Mag 7. Entry $390-405, target $480.’ },
summary: ‘Down 28% from $555 high. Software sector being destroyed but MSFT has best AI positioning. Cloud $50B milestone ignored.’,
news: [
{ headline: ‘Software stocks in freefall—IGV -28% from peak’, source: ‘Motley Fool’, url: ‘https://fool.com’, age: ‘2h’, weight: 95, sent: ‘neg’ },
{ headline: ‘Continuing post-earnings slide—now -13% total’, source: ‘Bloomberg’, url: ‘https://bloomberg.com’, age: ‘2h’, weight: 90, sent: ‘neg’ },
{ headline: ‘Cloud revenue hits $51.5B milestone’, source: ‘Microsoft IR’, url: ‘https://microsoft.com/investor’, age: ‘5d’, weight: 80, sent: ‘pos’ }
]
},
NVDA: {
name: ‘NVIDIA Corp’,
regularPrice: 171.81, regularChange: -8.39, regularPct: -4.66, regularTime: ‘4:00 PM’,
afterPrice: 170.50, afterChange: -1.31, afterPct: -0.76, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 55, stock: 45 },
contextType: ‘MEMORY CRUNCH’,
contextNarrative: ‘NVDA is 55% market (tech rotation, AI capex fears) and 45% stock-specific (gaming GPU delay, memory shortage). At 28x forward P/E, cheapest high-growth semi—but caught in rotation.’,
attribution: [
{ factor: ‘Gaming GPU delay—no new cards in 2026’, pct: 40, why: ‘All HBM memory going to datacenter, gaming deprioritized’ },
{ factor: ‘Tech sector rotation continuing’, pct: 35, why: ‘High-multiple semis sold across the board’ },
{ factor: ‘China H200 approval granted’, pct: -15, why: ‘Positive news offsetting some pressure’ },
{ factor: ‘Feb 25 earnings uncertainty’, pct: 10, why: ‘Pre-earnings derisking’ }
],
signal: { action: ‘ACCUMULATE’, confidence: 75, reasoning: ‘Best AI play at -18% from highs. At 28x forward, cheaper than most software. Buy $165-175, target $200+.’ },
summary: ‘Down 4.7% on gaming GPU delay due to memory crunch. Stock -18% from $212 high. Feb 25 earnings key catalyst.’,
news: [
{ headline: ‘No new gaming GPU in 2026—memory shortage’, source: ‘Reuters’, url: ‘https://reuters.com’, age: ‘4h’, weight: 95, sent: ‘neg’ },
{ headline: ‘China H200 export approval granted’, source: ‘Financial Times’, url: ‘https://ft.com’, age: ‘4h’, weight: 70, sent: ‘pos’ },
{ headline: ‘Jensen Huang: AI not replacing software’, source: ‘CNBC’, url: ‘https://cnbc.com’, age: ‘2d’, weight: 65, sent: ‘neut’ }
]
},
BTCUSD: {
name: ‘Bitcoin USD’,
regularPrice: 64249, regularChange: -8128, regularPct: -11.23, regularTime: ‘4:00 PM’,
afterPrice: 63800, afterChange: -449, afterPct: -0.70, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 70, stock: 30 },
contextType: ‘CRYPTO CRASH’,
contextNarrative: ‘BTC is 70% market (risk-off everywhere, $2B liquidations) and 30% crypto-specific (ETF outflows, technical breakdown). This is capitulation—RSI 24, worst day since FTX.’,
attribution: [
{ factor: ‘Mass liquidation cascade ($2B+ in 24h)’, pct: 40, why: ‘Leveraged longs wiped out, forced selling’ },
{ factor: ‘ETF institutional exodus ($1.7B weekly)’, pct: 25, why: ‘Institutions dumping, not buying dip’ },
{ factor: ‘Break below $70K support’, pct: 20, why: ‘Technical breakdown opens path to $60-65K’ },
{ factor: ‘Risk-off across all assets’, pct: 10, why: ‘Gold, silver, stocks all selling’ }
],
signal: { action: ‘WAIT’, confidence: 40, reasoning: ‘RSI 24 is oversold but catching knives dangerous. If believer, tiny buy $63-65K, stop $58K.’ },
summary: ‘In FREEFALL—down 44% from $126K ATH. ETF exodus, miners underwater at $87K cost vs $67K price. RSI 24 = deeply oversold.’,
news: [
{ headline: ‘Crashes below $64K—worst day since FTX’, source: ‘CoinDesk’, url: ‘https://coindesk.com’, age: ‘now’, weight: 100, sent: ‘neg’ },
{ headline: ‘$2B+ liquidations in 24 hours’, source: ‘CryptoNews’, url: ‘https://cryptonews.com’, age: ‘2h’, weight: 95, sent: ‘neg’ },
{ headline: ‘ETF outflows $1.7B weekly—institutional exodus’, source: ‘Bloomberg’, url: ‘https://bloomberg.com’, age: ‘1d’, weight: 90, sent: ‘neg’ }
]
},
MSTR: {
name: ‘MicroStrategy’,
regularPrice: 106.00, regularChange: -23.09, regularPct: -17.89, regularTime: ‘4:00 PM’,
afterPrice: 104.50, afterChange: -1.50, afterPct: -1.42, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 30, stock: 70 },
contextType: ‘LEVERED BTC’,
contextNarrative: ‘MSTR is 70% stock-specific (1.5-2x BTC beta) and 30% market (crypto contagion). At 1.03x mNAV, Saylor bet barely above water.’,
attribution: [
{ factor: ‘BTC -11% dragging MSTR at 1.5-2x beta’, pct: 60, why: ‘Levered proxy to Bitcoin amplifies moves’ },
{ factor: ‘Near breakeven on cost basis (1.03x mNAV)’, pct: 20, why: ‘Saylor premium evaporated’ },
{ factor: ‘Canaccord slashes target -60%’, pct: 10, why: ‘Analyst capitulation reflecting BTC reality’ }
],
signal: { action: ‘AVOID’, confidence: 45, reasoning: ‘Only for BTC true believers. Binary bet. If you must, tiny position with stop at $85.’ },
summary: ‘Destroyed as levered BTC proxy—down 65% from $457 peak. At 1.03x mNAV, barely above water on holdings.’,
news: [
{ headline: ‘Crashes 18% as BTC breaks $65K’, source: ‘CNBC’, url: ‘https://cnbc.com’, age: ‘now’, weight: 100, sent: ‘neg’ },
{ headline: ‘Canaccord slashes target to $185 from $474’, source: ‘TipRanks’, url: ‘https://tipranks.com’, age: ‘3h’, weight: 90, sent: ‘neg’ }
]
},
MU: {
name: ‘Micron Technology’,
regularPrice: 384.76, regularChange: 3.26, regularPct: 0.86, regularTime: ‘4:00 PM’,
afterPrice: 383.00, afterChange: -1.76, afterPct: -0.46, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 60, stock: 40 },
contextType: ‘AI MEMORY LEADER’,
contextNarrative: ‘MU is 60% market (semi rotation hurting) but fundamentals are 40% stock-specific (HBM sold out, +90% pricing). The AI memory story is REAL.’,
attribution: [
{ factor: ‘HBM sold out through 2026—prices +90%’, pct: 50, why: ‘AI memory shortage driving unprecedented pricing power’ },
{ factor: ‘Taiwan fab acquisition for expansion’, pct: 20, why: ‘Adding capacity to meet AI demand’ },
{ factor: ‘Tech selloff limiting upside’, pct: -25, why: ‘Down 16% from $455 ATH despite fundamentals’ }
],
signal: { action: ‘BUY THE DIP’, confidence: 78, reasoning: ‘Best AI memory play at -16% from highs. Entry $370-385, target $450+.’ },
summary: ‘Holding steady despite tech weakness. AI memory shortage is THE story—HBM sold out, prices +90%.’,
news: [
{ headline: ‘HBM sold out for 2026—prices up 90%’, source: ‘Reuters’, url: ‘https://reuters.com’, age: ‘2d’, weight: 95, sent: ‘pos’ },
{ headline: ‘Taiwan fab acquisition for HBM expansion’, source: ‘Bloomberg’, url: ‘https://bloomberg.com’, age: ‘2d’, weight: 90, sent: ‘pos’ }
]
},
AAPL: {
name: ‘Apple Inc’,
regularPrice: 275.91, regularChange: 0.59, regularPct: 0.21, regularTime: ‘4:00 PM’,
afterPrice: 275.50, afterChange: -0.41, afterPct: -0.15, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 30, stock: 70 },
contextType: ‘SAFE HAVEN’,
contextNarrative: ‘AAPL is 70% stock-specific (flight to quality, no capex overhang) and only 30% market. While software gets destroyed, Apple trades at 28x with hardware moat.’,
attribution: [
{ factor: ‘Flight to quality in tech massacre’, pct: 45, why: ‘Investors rotating from high-P/E to stable megacap’ },
{ factor: ‘No AI capex overhang’, pct: 30, why: ‘AI via partnerships (Claude, ChatGPT) not $200B spending’ },
{ factor: ‘Record Q1 still resonating’, pct: 15, why: ‘iPhone +23%, Services +14% momentum’ }
],
signal: { action: ‘HOLD’, confidence: 68, reasoning: ‘Safe haven in tech storm. Already up, limited upside. Wait for $265-270 to add.’ },
summary: ‘Outperforming during $1.2T tech wipeout. Flight to quality in action—no capex overhang unlike GOOGL/MSFT/AMZN.’,
news: [
{ headline: ‘Outperforms during $1.2T tech wipeout’, source: ‘Bloomberg’, url: ‘https://bloomberg.com’, age: ‘5h’, weight: 95, sent: ‘pos’ },
{ headline: ‘Record Q1 $143.8B revenue, iPhone +23%’, source: ‘Apple Newsroom’, url: ‘https://apple.com/newsroom’, age: ‘1w’, weight: 85, sent: ‘pos’ }
]
},
PLTR: {
name: ‘Palantir Tech’,
regularPrice: 140.80, regularChange: 1.26, regularPct: 0.90, regularTime: ‘4:00 PM’,
afterPrice: 139.00, afterChange: -1.80, afterPct: -1.28, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 40, stock: 60 },
contextType: ‘DEAD CAT BOUNCE’,
contextNarrative: ‘PLTR is 60% stock-specific (221x P/E valuation, -12% yesterday) and 40% market (software massacre). The +0.9% is dead cat bounce, not reversal.’,
attribution: [
{ factor: ‘Dead cat bounce after -12% crash’, pct: 45, why: ‘Oversold bounce, shorts covering’ },
{ factor: ‘Extreme valuation concern (221x P/E)’, pct: 35, why: ‘Growth great but priced in 10x over’ },
{ factor: ‘Software sector contagion’, pct: 15, why: ‘IGV -28%, all SaaS getting crushed’ }
],
signal: { action: ‘AVOID’, confidence: 58, reasoning: ‘At 221x P/E, still massively overvalued. Wait for $100-110 entry.’ },
summary: ‘Bouncing +0.9% after -12% bloodbath yesterday. 70% growth great but 221x P/E still extreme.’,
news: [
{ headline: ‘Bouncing after -12% crash yesterday’, source: ‘CNBC’, url: ‘https://cnbc.com’, age: ‘2h’, weight: 90, sent: ‘pos’ },
{ headline: ‘Citi warns on extreme 221x P/E valuation’, source: ‘TipRanks’, url: ‘https://tipranks.com’, age: ‘1d’, weight: 85, sent: ‘neg’ }
]
},
TSLA: {
name: ‘Tesla Inc’,
regularPrice: 397.21, regularChange: -8.80, regularPct: -2.17, regularTime: ‘4:00 PM’,
afterPrice: 395.00, afterChange: -2.21, afterPct: -0.56, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 40, stock: 60 },
contextType: ‘SALES COLLAPSE’,
contextNarrative: ‘TSLA is 60% stock-specific (EU sales cratering, brand damage) and 40% market (EV sector weakness). At 377x P/E, valuation assumes robotics/FSD success.’,
attribution: [
{ factor: ‘EU sales collapse (France -42%, Norway -88%)’, pct: 40, why: ‘Musk politics causing real brand damage in Europe’ },
{ factor: ‘US sales slowing (-17% YoY)’, pct: 25, why: ‘Competition intensifying from BYD, Rivian’ },
{ factor: ‘Valuation disconnect (377x P/E)’, pct: 20, why: ‘Car company priced like software, sales declining’ }
],
signal: { action: ‘AVOID’, confidence: 55, reasoning: ‘377x P/E for declining sales is insane. Wait for $350 or below.’ },
summary: ‘Down 2.2% as EU sales crater. At 377x P/E, valuation assumes AI/robotics success while car business deteriorates.’,
news: [
{ headline: ‘EU sales collapse: France -42%, Norway -88%’, source: ‘Financial Times’, url: ‘https://ft.com’, age: ‘3d’, weight: 90, sent: ‘neg’ },
{ headline: ‘US sales -17% YoY as competition grows’, source: ‘Reuters’, url: ‘https://reuters.com’, age: ‘3d’, weight: 85, sent: ‘neg’ }
]
},
META: {
name: ‘Meta Platforms’,
regularPrice: 655.00, regularChange: -14.00, regularPct: -2.09, regularTime: ‘4:00 PM’,
afterPrice: 652.00, afterChange: -3.00, afterPct: -0.46, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 50, stock: 50 },
contextType: ‘CAPEX FEARS’,
contextNarrative: ‘META is 50/50 market vs stock. Half is hyperscaler capex contagion, half is $115-135B guidance concerns. Ad business crushing it but Reality Labs losses raising eyebrows.’,
attribution: [
{ factor: ‘AI capex concerns ($115-135B)’, pct: 40, why: ‘Massive spending joining GOOGL/MSFT/AMZN capex fears’ },
{ factor: ‘Post-earnings profit-taking’, pct: 25, why: ‘Stock ran into earnings, now giving back gains’ },
{ factor: ‘Reality Labs losses (-$4.5B/Q)’, pct: 20, why: ‘Metaverse burn rate concerning’ }
],
signal: { action: ‘BUY’, confidence: 70, reasoning: ‘Best ad company at pre-earnings prices. Buy $640-660, target $750.’ },
summary: ‘Down 10% from high despite crushing Q4 ($59.9B rev, $8.88 EPS). Capex concerns weighing like GOOGL/MSFT.’,
news: [
{ headline: ‘Down 10% in week despite Q4 beat’, source: ‘Bloomberg’, url: ‘https://bloomberg.com’, age: ‘1d’, weight: 90, sent: ‘neg’ },
{ headline: ‘$115-135B capex guidance scares investors’, source: ‘CNBC’, url: ‘https://cnbc.com’, age: ‘1w’, weight: 85, sent: ‘neg’ }
]
},
QQQ: {
name: ‘Invesco QQQ Trust’,
regularPrice: 527.00, regularChange: -11.50, regularPct: -2.14, regularTime: ‘4:00 PM’,
afterPrice: 522.00, afterChange: -5.00, afterPct: -0.95, afterTime: ‘7:45 PM’,
analysisTime: ‘Feb 5, 2026 8:15 PM ET’,
marketContext: { market: 90, stock: 10 },
contextType: ‘TECH INDEX’,
contextNarrative: ‘QQQ is 90% market dynamics. The $1.2T tech wipeout is driven by: AI capex fears, software sector massacre, crypto contagion, risk-off rotation.’,
attribution: [
{ factor: ‘Big Tech capex fears (GOOGL/MSFT/AMZN)’, pct: 35, why: ‘$500B+ combined capex plans terrifying investors’ },
{ factor: ‘Software sector massacre (-28%)’, pct: 25, why: ‘AI disruption fears crushing SaaS valuations’ },
{ factor: ‘Crypto spillover (BTC -11%)’, pct: 15, why: ‘Risk assets correlating down together’ },
{ factor: ‘Growth-to-value rotation’, pct: 15, why: ‘Flight to quality, dividend payers’ }
],
signal: { action: ‘NIBBLE’, confidence: 65, reasoning: ‘Oversold but trend still down. Small buys okay, save powder for lower.’ },
summary: ‘$1.2T tech wipeout this week. Capex fears, software massacre, and crypto crash all hitting at once.’,
news: [
{ headline: ‘$1.2T tech wipeout this week’, source: ‘Bloomberg’, url: ‘https://bloomberg.com’, age: ‘1d’, weight: 95, sent: ‘neg’ },
{ headline: ‘Software sector -28% from highs on AI fears’, source: ‘Motley Fool’, url: ‘https://fool.com’, age: ‘2h’, weight: 90, sent: ‘neg’ }
]
}
};

export default function Dashboard() {
const [stocks, setStocks] = useState(DEFAULT_STOCKS);
const [watchlist, setWatchlist] = useState(Object.keys(DEFAULT_STOCKS));
const [selected, setSelected] = useState(‘AMZN’);
const [newTicker, setNewTicker] = useState(’’);
const [lastRefresh, setLastRefresh] = useState(null);
const [isMarketOpen, setIsMarketOpen] = useState(false);

// Check if market is open (9:30 AM - 4:00 PM ET, Mon-Fri)
const checkMarketOpen = () => {
const now = new Date();
const et = new Date(now.toLocaleString(‘en-US’, { timeZone: ‘America/New_York’ }));
const day = et.getDay();
const hour = et.getHours();
const min = et.getMinutes();
const timeNum = hour * 100 + min;
const open = day >= 1 && day <= 5 && timeNum >= 930 && timeNum < 1600;
setIsMarketOpen(open);
return open;
};

// Fetch prices from API
const fetchPrices = async () => {
try {
const res = await fetch(’/api/stocks’);
const data = await res.json();
if (data.stocks) {
setStocks(prev => {
const updated = { …prev };
data.stocks.forEach(s => {
if (updated[s.symbol]) {
updated[s.symbol] = {
…updated[s.symbol],
regularPrice: s.price,
regularChange: s.change,
regularPct: s.changePercent
};
}
});
return updated;
});
}
} catch (e) { console.log(‘Using cached prices’); }
setLastRefresh(new Date());
};

useEffect(() => {
checkMarketOpen();
fetchPrices();

```
// Check market status every minute
const marketCheck = setInterval(checkMarketOpen, 60000);

// Refresh every 30 minutes during market hours
const priceRefresh = setInterval(() => {
  if (checkMarketOpen()) {
    fetchPrices();
  }
}, 30 * 60 * 1000);

return () => {
  clearInterval(marketCheck);
  clearInterval(priceRefresh);
};
```

}, []);

const addTicker = () => {
const ticker = newTicker.toUpperCase().trim();
if (ticker && !watchlist.includes(ticker)) {
if (stocks[ticker]) {
setWatchlist([…watchlist, ticker]);
} else {
// Add placeholder for unknown ticker
setStocks(prev => ({
…prev,
[ticker]: {
name: ticker,
regularPrice: 0, regularChange: 0, regularPct: 0, regularTime: ‘–’,
afterPrice: 0, afterChange: 0, afterPct: 0, afterTime: ‘–’,
analysisTime: ‘Pending analysis’,
marketContext: { market: 50, stock: 50 },
contextType: ‘NEW’,
contextNarrative: ‘Analysis pending. Ask Claude to analyze this ticker.’,
attribution: [],
signal: { action: ‘ANALYZE’, confidence: 0, reasoning: ‘No analysis yet. Ask Claude to research this stock.’ },
summary: ‘No data yet.’,
news: []
}
}));
setWatchlist([…watchlist, ticker]);
}
setNewTicker(’’);
}
};

const removeTicker = (ticker) => {
setWatchlist(watchlist.filter(t => t !== ticker));
if (selected === ticker) {
setSelected(watchlist.find(t => t !== ticker) || watchlist[0]);
}
};

const sigColor = (action) => {
if (!action) return ‘#6b7280’;
if (action.includes(‘BUY’) || action.includes(‘ACCUMULATE’)) return ‘#22c55e’;
if (action.includes(‘AVOID’)) return ‘#ef4444’;
if (action.includes(‘WAIT’) || action.includes(‘HOLD’) || action.includes(‘NIBBLE’)) return ‘#eab308’;
return ‘#f59e0b’;
};

const sentColor = (s) => s === ‘pos’ ? ‘#22c55e’ : s === ‘neg’ ? ‘#ef4444’ : ‘#6b7280’;

const s = stocks[selected];
if (!s) return <div>Loading…</div>;

const formatPrice = (p) => p > 1000 ? p.toLocaleString(undefined, {maximumFractionDigits: 0}) : p.toFixed(2);

return (
<>
<Head><title>Stock Dashboard</title></Head>
<div style={{minHeight:‘100vh’,background:’#0f172a’,padding:‘12px’,fontFamily:‘system-ui,sans-serif’,color:‘white’}}>

```
    {/* Header */}
    <div style={{marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
      <div>
        <h1 style={{fontSize:18,fontWeight:'bold',margin:0}}>📈 Stock Dashboard</h1>
        <div style={{fontSize:10,color:'#64748b'}}>
          {isMarketOpen ? '🟢 Market Open' : '🔴 Market Closed'} • 
          Last refresh: {lastRefresh?.toLocaleTimeString() || '--'}
          {isMarketOpen && ' • Auto-refresh every 30 min'}
        </div>
      </div>
    </div>

    {/* Add Ticker */}
    <div style={{display:'flex',gap:8,marginBottom:12}}>
      <input
        type="text"
        value={newTicker}
        onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && addTicker()}
        placeholder="Add ticker..."
        style={{flex:1,maxWidth:150,background:'#1e293b',border:'1px solid #334155',borderRadius:6,padding:'8px 12px',color:'white',fontSize:14}}
      />
      <button onClick={addTicker} style={{background:'#22c55e',border:'none',borderRadius:6,padding:'8px 16px',color:'white',fontWeight:'bold',cursor:'pointer'}}>+</button>
    </div>

    {/* Ticker Cards - Horizontal Scroll */}
    <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:8,marginBottom:16}}>
      {watchlist.map(sym => {
        const d = stocks[sym];
        if (!d) return null;
        const isSel = sym === selected;
        const up = d.regularChange >= 0;
        const afterUp = d.afterChange >= 0;
        return (
          <div key={sym} onClick={() => setSelected(sym)} style={{
            minWidth:140,flexShrink:0,
            background: isSel ? '#1e3a5f' : '#1e293b',
            border: `2px solid ${isSel ? '#22d3ee' : '#334155'}`,
            borderRadius:8,padding:10,cursor:'pointer',position:'relative'
          }}>
            <button onClick={(e) => {e.stopPropagation(); removeTicker(sym);}} style={{
              position:'absolute',top:4,right:4,background:'none',border:'none',color:'#64748b',cursor:'pointer',fontSize:14,padding:2
            }}>✕</button>
            <div style={{fontWeight:'bold',fontSize:14}}>{sym}</div>
            <div style={{fontSize:9,color:'#64748b',marginBottom:4}}>{d.contextType}</div>
            <div style={{fontWeight:'bold',fontSize:15}}>${formatPrice(d.regularPrice)}</div>
            <div style={{fontSize:11,color:up?'#22c55e':'#ef4444'}}>{up?'+':''}{d.regularPct.toFixed(2)}% <span style={{color:'#64748b'}}>close</span></div>
            {d.afterChange !== 0 && (
              <div style={{fontSize:10,color:afterUp?'#22c55e':'#ef4444'}}>{afterUp?'+':''}{d.afterPct.toFixed(2)}% <span style={{color:'#64748b'}}>AH</span></div>
            )}
          </div>
        );
      })}
    </div>

    {/* Selected Stock Detail */}
    <div style={{background:'#1e293b',borderRadius:12,padding:16,border:'1px solid #334155'}}>
      
      {/* Header */}
      <div style={{marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:8}}>
          <div>
            <h2 style={{fontSize:24,fontWeight:'bold',margin:0}}>{selected}</h2>
            <div style={{fontSize:12,color:'#94a3b8'}}>{s.name}</div>
            <span style={{fontSize:10,background:'#334155',padding:'2px 8px',borderRadius:4,display:'inline-block',marginTop:4}}>{s.contextType}</span>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:28,fontWeight:'bold'}}>${formatPrice(s.regularPrice)}</div>
            <div style={{fontSize:14,color:s.regularChange>=0?'#22c55e':'#ef4444'}}>
              {s.regularChange>=0?'+':''}{s.regularChange.toFixed(2)} ({s.regularPct>=0?'+':''}{s.regularPct.toFixed(2)}%)
            </div>
            <div style={{fontSize:10,color:'#64748b'}}>Close @ {s.regularTime}</div>
            {s.afterChange !== 0 && (
              <>
                <div style={{fontSize:12,color:s.afterChange>=0?'#22c55e':'#ef4444',marginTop:4}}>
                  AH: {s.afterChange>=0?'+':''}{s.afterChange.toFixed(2)} ({s.afterPct>=0?'+':''}{s.afterPct.toFixed(2)}%)
                </div>
                <div style={{fontSize:10,color:'#64748b'}}>After-hours @ {s.afterTime}</div>
              </>
            )}
          </div>
        </div>
        <div style={{fontSize:9,color:'#475569',marginTop:8}}>📊 Analysis: {s.analysisTime}</div>
      </div>

      {/* Trade Signal */}
      <div style={{background:'#111827',borderRadius:8,padding:12,marginBottom:12,borderLeft:`4px solid ${sigColor(s.signal.action)}`}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
          <div>
            <div style={{fontSize:9,color:'#9ca3af'}}>SIGNAL</div>
            <div style={{color:sigColor(s.signal.action),fontWeight:700,fontSize:15}}>{s.signal.action}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:9,color:'#9ca3af'}}>CONFIDENCE</div>
            <div style={{fontWeight:700,fontSize:16}}>{s.signal.confidence}%</div>
          </div>
        </div>
        <div style={{fontSize:12,color:'#d1d5db',lineHeight:1.4}}>{s.signal.reasoning}</div>
      </div>

      {/* Market vs Stock Context */}
      <div style={{background:'#111827',borderRadius:8,padding:12,marginBottom:12}}>
        <h3 style={{fontSize:11,color:'#9ca3af',margin:'0 0 8px'}}>📊 MARKET vs STOCK</h3>
        <div style={{display:'flex',height:8,borderRadius:4,overflow:'hidden',marginBottom:6}}>
          <div style={{width:`${s.marketContext.market}%`,background:'#3b82f6'}}/>
          <div style={{width:`${s.marketContext.stock}%`,background:'#f59e0b'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:10,marginBottom:8}}>
          <span style={{color:'#3b82f6'}}>🌊 Market: {s.marketContext.market}%</span>
          <span style={{color:'#f59e0b'}}>🎯 Stock: {s.marketContext.stock}%</span>
        </div>
        <p style={{fontSize:11,color:'#94a3b8',lineHeight:1.4,margin:0}}>{s.contextNarrative}</p>
      </div>

      {/* Why It's Moving */}
      {s.attribution.length > 0 && (
        <div style={{marginBottom:12}}>
          <h3 style={{fontSize:11,color:'#9ca3af',margin:'0 0 8px'}}>🔍 WHY IT'S MOVING</h3>
          {s.attribution.map((a,i) => (
            <div key={i} style={{background:'#111827',borderRadius:6,padding:8,marginBottom:6}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                <span style={{fontWeight:600,fontSize:11}}>{a.factor}</span>
                <span style={{
                  background: a.pct > 0 ? '#7f1d1d' : '#14532d',
                  color: a.pct > 0 ? '#fca5a5' : '#86efac',
                  padding:'1px 6px',borderRadius:4,fontSize:10,fontWeight:600
                }}>{a.pct > 0 ? '+' : ''}{a.pct}%</span>
              </div>
              <div style={{fontSize:10,color:'#9ca3af'}}>{a.why}</div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div style={{background:'#111827',borderRadius:8,padding:10,marginBottom:12}}>
        <h3 style={{fontSize:10,color:'#9ca3af',margin:'0 0 4px'}}>📝 SUMMARY</h3>
        <p style={{fontSize:12,color:'#d1d5db',margin:0,lineHeight:1.4}}>{s.summary}</p>
      </div>

      {/* News Sources */}
      {s.news.length > 0 && (
        <div>
          <h3 style={{fontSize:11,color:'#9ca3af',margin:'0 0 8px'}}>📰 NEWS SOURCES</h3>
          {s.news.map((n,i) => (
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,padding:8,background:i%2===0?'#111827':'transparent',borderRadius:6,marginBottom:2}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:sentColor(n.sent),marginTop:4,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:11,lineHeight:1.3}}>{n.headline}</div>
                <div style={{fontSize:9,color:'#6b7280',marginTop:2}}>
                  <a href={n.url} target="_blank" rel="noopener noreferrer" style={{color:'#22d3ee',textDecoration:'none'}}>{n.source}</a>
                  {' '}• {n.age} • Wt:{n.weight}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div style={{textAlign:'center',marginTop:12,fontSize:9,color:'#475569'}}>
      Not financial advice • Data may be delayed
    </div>
  </div>
</>
```

);
}
