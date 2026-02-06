import { useState, useEffect } from 'react';
import Head from 'next/head';

// Full Stock Dashboard - Feb 5, 2026
// Features: News Attribution, Market vs Stock Context, Trade Signals, Source Links

const STOCKS = {
  AMZN: {
    name: 'Amazon.com', price: 200.02, change: -32.97, pct: -14.15,
    marketContext: { market: 40, stock: 60 },
    contextType: 'EARNINGS SHOCK',
    contextNarrative: 'AMZN crash is 60% stock-specific (capex shock) and 40% market (Big Tech capex fears spreading). AWS +20% ignored as $200B spending terrifies investors questioning AI ROI.',
    attribution: [
      { factor: '$200B capex guidance (60% above 2025)', pct: 45, why: 'Massive AI infrastructure spend spooked investors on ROI timeline' },
      { factor: 'Slight EPS miss ($1.95 vs $1.97)', pct: 25, why: 'Even 2-cent misses punished at these valuations' },
      { factor: 'AWS +20% growth overlooked', pct: -15, why: 'Best cloud quarter providing floor to selling' },
      { factor: 'Sector contagion from GOOGL/MSFT', pct: 10, why: 'All hyperscalers getting capex haircut' }
    ],
    signal: { action: 'BUY THE PANIC', confidence: 72, reasoning: '-14% on slight miss is panic. AWS +20% is phenomenal. Entry $195-205, target $250.' },
    summary: 'Crashing on $200B capex shock—higher than GOOGL ($180B) and META ($135B). AWS crushed it but AI spending fears dominate.',
    news: [
      { headline: 'CRASHES 10%+ on $200B capex guidance shock', source: 'CNBC', url: 'https://cnbc.com', age: 'now', weight: 100, sent: 'neg' },
      { headline: 'Q4 EPS $1.95 misses $1.97 estimate', source: 'Reuters', url: 'https://reuters.com', age: '1h', weight: 95, sent: 'neg' },
      { headline: 'AWS $35.58B beats, +20.2% YoY', source: 'TechCrunch', url: 'https://techcrunch.com', age: '1h', weight: 85, sent: 'pos' }
    ]
  },
  GOOGL: {
    name: 'Alphabet Inc', price: 318.55, change: -14.49, pct: -4.35,
    marketContext: { market: 50, stock: 50 },
    contextType: 'POST-EARNINGS',
    contextNarrative: 'GOOGL is 50/50 market vs stock. Half is hyperscaler capex contagion (MSFT, AMZN fears spreading), half is digesting $175-185B capex guidance. Cloud +48% being completely overlooked.',
    attribution: [
      { factor: 'Capex digestion ($175-185B vs $119B est)', pct: 45, why: '55% higher than expected—AI spending fears across sector' },
      { factor: 'Cloud +48% being overlooked', pct: -25, why: 'Best cloud growth in industry ignored amid panic' },
      { factor: 'Hyperscaler contagion', pct: 15, why: 'MSFT -28%, AMZN -14% dragging sentiment' },
      { factor: 'Analyst upgrades providing floor', pct: -10, why: 'Scotiabank $400 target, multiple Buy ratings' }
    ],
    signal: { action: 'BUY', confidence: 72, reasoning: 'Cloud +48% justifies capex. Entry $310-325, target $400.' },
    summary: 'Down 4% digesting $175-185B capex guidance. Cloud +48% is phenomenal but overshadowed by spending fears.',
    news: [
      { headline: '$175-185B capex shocked market—55% above estimates', source: 'Bloomberg', url: 'https://bloomberg.com', age: '1d', weight: 95, sent: 'neg' },
      { headline: 'Cloud revenue +48% YoY—best in class', source: 'CNBC', url: 'https://cnbc.com', age: '1d', weight: 90, sent: 'pos' },
      { headline: 'Scotiabank raises target to $400', source: 'TipRanks', url: 'https://tipranks.com', age: '1d', weight: 75, sent: 'pos' }
    ]
  },
  MSFT: {
    name: 'Microsoft Corp', price: 393.67, change: -20.12, pct: -4.86,
    marketContext: { market: 60, stock: 40 },
    contextType: 'SOFTWARE MASSACRE',
    contextNarrative: 'MSFT is 60% market context (software sector down 28%, AI disruption fears) and 40% stock-specific (Azure decel, capex concerns). Irony: at 25.7x P/E, MSFT is CHEAPER than S&P average but treated like bloated SaaS.',
    attribution: [
      { factor: 'Software sector massacre (-28% from highs)', pct: 35, why: 'IGV ETF crushed as AI threatens SaaS model' },
      { factor: 'Post-earnings selloff extends', pct: 30, why: '-9.8% on earnings, now -3% more today' },
      { factor: '$37.5B quarterly AI capex', pct: 20, why: 'Investors questioning ROI on massive spending' },
      { factor: 'Azure 39% growth "disappointed"', pct: 10, why: 'Even 39% growth not enough for expectations' }
    ],
    signal: { action: 'STRONG BUY', confidence: 78, reasoning: 'Best enterprise software at 25.7x P/E—cheapest Mag 7. Entry $390-405, target $480.' },
    summary: 'Down 28% from $555 high. Software sector being destroyed but MSFT has best AI positioning. Cloud $50B milestone ignored.',
    news: [
      { headline: 'Software stocks in freefall—IGV -28% from peak', source: 'Motley Fool', url: 'https://fool.com', age: '2h', weight: 95, sent: 'neg' },
      { headline: 'Continuing post-earnings slide—now -13% total', source: 'Bloomberg', url: 'https://bloomberg.com', age: '2h', weight: 90, sent: 'neg' },
      { headline: 'Cloud revenue hits $51.5B milestone', source: 'Microsoft IR', url: 'https://microsoft.com/investor', age: '5d', weight: 80, sent: 'pos' }
    ]
  },
  NVDA: {
    name: 'NVIDIA Corp', price: 171.81, change: -8.39, pct: -4.66,
    marketContext: { market: 55, stock: 45 },
    contextType: 'MEMORY CRUNCH',
    contextNarrative: 'NVDA is 55% market (tech rotation, AI capex fears) and 45% stock-specific (gaming GPU delay, memory shortage). At 28x forward P/E, cheapest high-growth semi—but caught in rotation.',
    attribution: [
      { factor: 'Gaming GPU delay—no new cards in 2026', pct: 40, why: 'All HBM memory going to datacenter, gaming deprioritized' },
      { factor: 'Tech sector rotation continuing', pct: 35, why: 'High-multiple semis sold across the board' },
      { factor: 'China H200 approval granted', pct: -15, why: 'Positive news offsetting some pressure' },
      { factor: 'Feb 25 earnings uncertainty', pct: 10, why: 'Pre-earnings derisking' }
    ],
    signal: { action: 'ACCUMULATE', confidence: 75, reasoning: 'Best AI play at -18% from highs. At 28x forward, cheaper than most software. Buy $165-175, target $200+.' },
    summary: 'Down 4.7% on gaming GPU delay due to memory crunch. Stock -18% from $212 high. Feb 25 earnings key catalyst.',
    news: [
      { headline: 'No new gaming GPU in 2026—memory shortage', source: 'Reuters', url: 'https://reuters.com', age: '4h', weight: 95, sent: 'neg' },
      { headline: 'China H200 export approval granted', source: 'Financial Times', url: 'https://ft.com', age: '4h', weight: 70, sent: 'pos' },
      { headline: 'Jensen Huang: AI not replacing software', source: 'CNBC', url: 'https://cnbc.com', age: '2d', weight: 65, sent: 'neut' }
    ]
  },
  BTCUSD: {
    name: 'Bitcoin USD', price: 64249, change: -8128, pct: -11.23,
    marketContext: { market: 70, stock: 30 },
    contextType: 'CRYPTO CRASH',
    contextNarrative: 'BTC is 70% market (risk-off everywhere, $2B liquidations) and 30% crypto-specific (ETF outflows, technical breakdown). This is capitulation—RSI 24, worst day since FTX.',
    attribution: [
      { factor: 'Mass liquidation cascade ($2B+ in 24h)', pct: 40, why: 'Leveraged longs wiped out, forced selling' },
      { factor: 'ETF institutional exodus ($1.7B weekly)', pct: 25, why: 'Institutions dumping, not buying dip' },
      { factor: 'Break below $70K support', pct: 20, why: 'Technical breakdown opens path to $60-65K' },
      { factor: 'Risk-off across all assets', pct: 10, why: 'Gold, silver, stocks all selling' }
    ],
    signal: { action: 'WAIT', confidence: 40, reasoning: 'RSI 24 is oversold but catching knives dangerous. If believer, tiny buy $63-65K, stop $58K.' },
    summary: 'In FREEFALL—down 44% from $126K ATH. ETF exodus, miners underwater at $87K cost vs $67K price. RSI 24 = deeply oversold.',
    news: [
      { headline: 'Crashes below $64K—worst day since FTX', source: 'CoinDesk', url: 'https://coindesk.com', age: 'now', weight: 100, sent: 'neg' },
      { headline: '$2B+ liquidations in 24 hours', source: 'CryptoNews', url: 'https://cryptonews.com', age: '2h', weight: 95, sent: 'neg' },
      { headline: 'ETF outflows $1.7B weekly—institutional exodus', source: 'Bloomberg', url: 'https://bloomberg.com', age: '1d', weight: 90, sent: 'neg' }
    ]
  },
  MSTR: {
    name: 'Strategy (MicroStrategy)', price: 106.00, change: -23.09, pct: -17.89,
    marketContext: { market: 30, stock: 70 },
    contextType: 'LEVERED BTC',
    contextNarrative: 'MSTR is 70% stock-specific (1.5-2x BTC beta) and 30% market (crypto contagion). At 1.03x mNAV, Saylor bet barely above water. Pure BTC derivative—if BTC bounces 10%, MSTR rips 15-20%.',
    attribution: [
      { factor: 'BTC -11% dragging MSTR at 1.5-2x beta', pct: 60, why: 'Levered proxy to Bitcoin amplifies moves' },
      { factor: 'Near breakeven on cost basis (1.03x mNAV)', pct: 20, why: 'Saylor premium evaporated' },
      { factor: 'Canaccord slashes target -60%', pct: 10, why: 'Analyst capitulation reflecting BTC reality' }
    ],
    signal: { action: 'AVOID', confidence: 45, reasoning: 'Only for BTC true believers. Binary bet. If you must, tiny position with stop at $85.' },
    summary: 'Destroyed as levered BTC proxy—down 65% from $457 peak. At 1.03x mNAV, barely above water on holdings.',
    news: [
      { headline: 'Crashes 18% as BTC breaks $65K', source: 'CNBC', url: 'https://cnbc.com', age: 'now', weight: 100, sent: 'neg' },
      { headline: 'Canaccord slashes target to $185 from $474', source: 'TipRanks', url: 'https://tipranks.com', age: '3h', weight: 90, sent: 'neg' },
      { headline: 'Q4 earnings call today 5 PM ET', source: 'MicroStrategy IR', url: 'https://microstrategy.com', age: '4h', weight: 70, sent: 'neut' }
    ]
  },
  MU: {
    name: 'Micron Technology', price: 384.76, change: 3.26, pct: 0.86,
    marketContext: { market: 60, stock: 40 },
    contextType: 'AI MEMORY LEADER',
    contextNarrative: 'MU is 60% market (semi rotation hurting) but fundamentals are 40% stock-specific (HBM sold out, +90% pricing). The AI memory story is REAL—shortage through 2026.',
    attribution: [
      { factor: 'HBM sold out through 2026—prices +90%', pct: 50, why: 'AI memory shortage driving unprecedented pricing power' },
      { factor: 'Taiwan fab acquisition for expansion', pct: 20, why: 'Adding capacity to meet AI demand' },
      { factor: 'Tech selloff limiting upside', pct: -25, why: 'Down 16% from $455 ATH despite fundamentals' },
      { factor: 'Insider selling $10.7M', pct: -5, why: 'Minor headwind from exec sales' }
    ],
    signal: { action: 'BUY THE DIP', confidence: 78, reasoning: 'Best AI memory play at -16% from highs. Entry $370-385, target $450+.' },
    summary: 'Holding steady despite tech weakness. AI memory shortage is THE story—HBM sold out, prices +90%. Fundamentals stellar.',
    news: [
      { headline: 'HBM sold out for 2026—prices up 90%', source: 'Reuters', url: 'https://reuters.com', age: '2d', weight: 95, sent: 'pos' },
      { headline: 'Taiwan fab acquisition for HBM expansion', source: 'Bloomberg', url: 'https://bloomberg.com', age: '2d', weight: 90, sent: 'pos' },
      { headline: 'EVP sells $10.7M in stock', source: 'SEC Filing', url: 'https://sec.gov', age: '3d', weight: 60, sent: 'neg' }
    ]
  },
  AAPL: {
    name: 'Apple Inc', price: 275.91, change: 0.59, pct: 0.21,
    marketContext: { market: 30, stock: 70 },
    contextType: 'SAFE HAVEN',
    contextNarrative: 'AAPL is 70% stock-specific (flight to quality, no capex overhang) and only 30% market. While software gets destroyed, Apple trades at 28x with hardware moat. Investors HIDING here.',
    attribution: [
      { factor: 'Flight to quality in tech massacre', pct: 45, why: 'Investors rotating from high-P/E to stable megacap' },
      { factor: 'No AI capex overhang', pct: 30, why: 'AI via partnerships (Claude, ChatGPT) not $200B spending' },
      { factor: 'Record Q1 still resonating', pct: 15, why: 'iPhone +23%, Services +14% momentum' },
      { factor: 'Dividend/buyback support', pct: 5, why: '$110B+ annual returns to shareholders' }
    ],
    signal: { action: 'HOLD', confidence: 68, reasoning: 'Safe haven in tech storm. Already up, limited upside. Wait for $265-270 to add.' },
    summary: 'Outperforming during $1.2T tech wipeout. Flight to quality in action—no capex overhang unlike GOOGL/MSFT/AMZN.',
    news: [
      { headline: 'Outperforms during $1.2T tech wipeout', source: 'Bloomberg', url: 'https://bloomberg.com', age: '5h', weight: 95, sent: 'pos' },
      { headline: 'Record Q1 $143.8B revenue, iPhone +23%', source: 'Apple Newsroom', url: 'https://apple.com/newsroom', age: '1w', weight: 85, sent: 'pos' },
      { headline: 'AI via partnerships, not massive capex', source: 'CNBC', url: 'https://cnbc.com', age: '3d', weight: 80, sent: 'pos' }
    ]
  },
  PLTR: {
    name: 'Palantir Tech', price: 140.80, change: 1.26, pct: 0.90,
    marketContext: { market: 40, stock: 60 },
    contextType: 'DEAD CAT BOUNCE',
    contextNarrative: 'PLTR is 60% stock-specific (221x P/E valuation, -12% yesterday) and 40% market (software massacre). The +0.9% is dead cat bounce, not reversal. 70% growth amazing but priced for 10x that.',
    attribution: [
      { factor: 'Dead cat bounce after -12% crash', pct: 45, why: 'Oversold bounce, shorts covering' },
      { factor: 'Extreme valuation concern (221x P/E)', pct: 35, why: 'Growth great but priced in 10x over' },
      { factor: 'Software sector contagion', pct: 15, why: 'IGV -28%, all SaaS getting crushed' },
      { factor: '70% revenue growth supporting', pct: -10, why: 'Fundamentals excellent, just overpriced' }
    ],
    signal: { action: 'AVOID', confidence: 58, reasoning: 'At 221x P/E, still massively overvalued. Wait for $100-110 entry.' },
    summary: 'Bouncing +0.9% after -12% bloodbath yesterday. 70% growth great but 221x P/E still extreme. Dead cat bounce likely.',
    news: [
      { headline: 'Bouncing after -12% crash yesterday', source: 'CNBC', url: 'https://cnbc.com', age: '2h', weight: 90, sent: 'pos' },
      { headline: 'Citi warns on extreme 221x P/E valuation', source: 'TipRanks', url: 'https://tipranks.com', age: '1d', weight: 85, sent: 'neg' },
      { headline: 'Q4 revenue surged 70% YoY—beats estimates', source: 'Palantir IR', url: 'https://palantir.com', age: '2d', weight: 80, sent: 'pos' }
    ]
  },
  TSLA: {
    name: 'Tesla Inc', price: 397.21, change: -8.80, pct: -2.17,
    marketContext: { market: 40, stock: 60 },
    contextType: 'SALES COLLAPSE',
    contextNarrative: 'TSLA is 60% stock-specific (EU sales cratering, brand damage) and 40% market (EV sector weakness). At 377x P/E, valuation assumes robotics/FSD success while car business deteriorates.',
    attribution: [
      { factor: 'EU sales collapse (France -42%, Norway -88%)', pct: 40, why: 'Musk politics causing real brand damage in Europe' },
      { factor: 'US sales slowing (-17% YoY)', pct: 25, why: 'Competition intensifying from BYD, Rivian' },
      { factor: 'Valuation disconnect (377x P/E)', pct: 20, why: 'Car company priced like software, sales declining' },
      { factor: 'Tech sector rotation', pct: 10, why: 'Growth-to-value shift hurting high-multiple names' }
    ],
    signal: { action: 'AVOID', confidence: 55, reasoning: '377x P/E for declining sales is insane. Wait for $350 or below.' },
    summary: 'Down 2.2% as EU sales crater. At 377x P/E, valuation assumes AI/robotics success while car business deteriorates.',
    news: [
      { headline: 'EU sales collapse: France -42%, Norway -88%', source: 'Financial Times', url: 'https://ft.com', age: '3d', weight: 90, sent: 'neg' },
      { headline: 'US sales -17% YoY as competition grows', source: 'Reuters', url: 'https://reuters.com', age: '3d', weight: 85, sent: 'neg' },
      { headline: 'SpaceX-xAI merger—no Tesla benefit', source: 'CNBC', url: 'https://cnbc.com', age: '2d', weight: 70, sent: 'neut' }
    ]
  },
  META: {
    name: 'Meta Platforms', price: 655.00, change: -14.00, pct: -2.09,
    marketContext: { market: 50, stock: 50 },
    contextType: 'CAPEX FEARS',
    contextNarrative: 'META is 50/50 market vs stock. Half is hyperscaler capex contagion, half is $115-135B guidance concerns. Ad business crushing it but Reality Labs losses (-$4.5B/quarter) raising eyebrows.',
    attribution: [
      { factor: 'AI capex concerns ($115-135B)', pct: 40, why: 'Massive spending joining GOOGL/MSFT/AMZN capex fears' },
      { factor: 'Post-earnings profit-taking', pct: 25, why: 'Stock ran into earnings, now giving back gains' },
      { factor: 'Reality Labs losses (-$4.5B/Q)', pct: 20, why: 'Metaverse burn rate concerning despite Zuck commitment' },
      { factor: 'Ad business strength ignored', pct: -15, why: '$59.9B rev, Reels gaining on TikTok' }
    ],
    signal: { action: 'BUY', confidence: 70, reasoning: 'Best ad company at pre-earnings prices. Buy $640-660, target $750.' },
    summary: 'Down 10% from high despite crushing Q4 ($59.9B rev, $8.88 EPS). Capex concerns weighing like GOOGL/MSFT.',
    news: [
      { headline: 'Down 10% in week despite Q4 beat', source: 'Bloomberg', url: 'https://bloomberg.com', age: '1d', weight: 90, sent: 'neg' },
      { headline: '$115-135B capex guidance scares investors', source: 'CNBC', url: 'https://cnbc.com', age: '1w', weight: 85, sent: 'neg' },
      { headline: 'Reels gaining share against TikTok', source: 'TechCrunch', url: 'https://techcrunch.com', age: '5d', weight: 75, sent: 'pos' }
    ]
  },
  QQQ: {
    name: 'Invesco QQQ Trust', price: 527.00, change: -11.50, pct: -2.14,
    marketContext: { market: 90, stock: 10 },
    contextType: 'TECH INDEX',
    contextNarrative: 'QQQ is 90% market dynamics. The $1.2T tech wipeout is driven by: (1) AI capex fears across hyperscalers, (2) Software sector massacre on AI disruption fears, (3) Crypto contagion, (4) Risk-off rotation.',
    attribution: [
      { factor: 'Big Tech capex fears (GOOGL/MSFT/AMZN)', pct: 35, why: '$500B+ combined capex plans terrifying investors' },
      { factor: 'Software sector massacre (-28%)', pct: 25, why: 'AI disruption fears crushing SaaS valuations' },
      { factor: 'Crypto spillover (BTC -11%)', pct: 15, why: 'Risk assets correlating down together' },
      { factor: 'Growth-to-value rotation', pct: 15, why: 'Flight to quality, dividend payers' },
      { factor: 'Pre-earnings derisking', pct: 5, why: 'AMZN earnings spooked everyone' }
    ],
    signal: { action: 'NIBBLE', confidence: 65, reasoning: 'Oversold but trend still down. Small buys okay, save powder for lower.' },
    summary: '$1.2T tech wipeout this week. Capex fears, software massacre, and crypto crash all hitting at once.',
    news: [
      { headline: '$1.2T tech wipeout this week', source: 'Bloomberg', url: 'https://bloomberg.com', age: '1d', weight: 95, sent: 'neg' },
      { headline: 'Software sector -28% from highs on AI fears', source: 'Motley Fool', url: 'https://fool.com', age: '2h', weight: 90, sent: 'neg' },
      { headline: 'Big Tech capex concerns spreading', source: 'CNBC', url: 'https://cnbc.com', age: '1d', weight: 85, sent: 'neg' }
    ]
  }
};

export default function Dashboard() {
  const [selected, setSelected] = useState('AMZN');
  const [prices, setPrices] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/stocks');
        const data = await res.json();
        if (data.stocks) {
          const priceMap = {};
          data.stocks.forEach(s => { priceMap[s.symbol] = s; });
          setPrices(priceMap);
        }
      } catch (e) { console.log('Using static prices'); }
      setLastUpdate(new Date());
    };
    fetchPrices();
    const i = setInterval(fetchPrices, 60000);
    return () => clearInterval(i);
  }, []);

  const getPrice = (sym) => prices[sym]?.price || STOCKS[sym]?.price || 0;
  const getChange = (sym) => prices[sym]?.change || STOCKS[sym]?.change || 0;
  const getPct = (sym) => prices[sym]?.changePercent || STOCKS[sym]?.pct || 0;

  const sigColor = (action) => {
    if (!action) return '#6b7280';
    if (action.includes('BUY') || action.includes('ACCUMULATE')) return '#22c55e';
    if (action.includes('AVOID')) return '#ef4444';
    if (action.includes('WAIT') || action.includes('HOLD')) return '#eab308';
    return '#f59e0b';
  };

  const sentColor = (s) => s === 'pos' ? '#22c55e' : s === 'neg' ? '#ef4444' : '#6b7280';

  const s = STOCKS[selected];

  return (
    <>
      <Head><title>Stock Dashboard - Feb 5, 2026</title></Head>
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f172a,#1e293b)',padding:16,fontFamily:'system-ui,sans-serif',color:'white'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:8}}>
            <div>
              <h1 style={{fontSize:24,fontWeight:'bold',margin:0,background:'linear-gradient(90deg,#22d3ee,#3b82f6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>📈 Stock Intelligence Dashboard</h1>
              <p style={{fontSize:11,color:'#64748b',margin:'4px 0 0'}}>News Attribution • Market Context • Trade Signals</p>
            </div>
            <div style={{fontSize:11,color:'#64748b'}}>Updated: {lastUpdate?.toLocaleTimeString()} • Feb 5, 2026</div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:16}}>
            {/* Ticker List */}
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {Object.entries(STOCKS).map(([sym, d]) => {
                const up = getChange(sym) >= 0;
                const isSel = sym === selected;
                return (
                  <div key={sym} onClick={() => setSelected(sym)} style={{
                    background: isSel ? 'linear-gradient(90deg,rgba(34,211,238,0.15),rgba(59,130,246,0.15))' : '#1e293b',
                    border: `2px solid ${isSel ? '#22d3ee' : sigColor(d.signal.action)}`,
                    borderRadius:10,padding:10,cursor:'pointer',transition:'all 0.2s'
                  }}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div>
                        <div style={{fontWeight:'bold',fontSize:14}}>{sym}</div>
                        <div style={{fontSize:9,color:'#64748b'}}>{d.contextType}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontWeight:'bold',fontSize:14}}>${getPrice(sym).toLocaleString(undefined,{minimumFractionDigits:getPrice(sym)>1000?0:2,maximumFractionDigits:getPrice(sym)>1000?0:2})}</div>
                        <div style={{fontSize:12,color:up?'#22c55e':'#ef4444'}}>{up?'+':''}{getPct(sym).toFixed(2)}%</div>
                      </div>
                    </div>
                    <div style={{display:'flex',height:4,borderRadius:2,overflow:'hidden',marginTop:6}}>
                      <div style={{width:`${d.marketContext.market}%`,background:'#3b82f6'}}/>
                      <div style={{width:`${d.marketContext.stock}%`,background:'#f59e0b'}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail Panel */}
            <div style={{background:'#1e293b',borderRadius:12,padding:20,border:'1px solid #334155'}}>
              {/* Header */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,flexWrap:'wrap',gap:12}}>
                <div>
                  <h2 style={{fontSize:28,fontWeight:'bold',margin:0}}>{selected}</h2>
                  <p style={{fontSize:14,color:'#94a3b8',margin:'4px 0'}}>{s.name}</p>
                  <span style={{fontSize:10,background:'#334155',padding:'3px 8px',borderRadius:4}}>{s.contextType}</span>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:32,fontWeight:'bold'}}>${getPrice(selected).toLocaleString(undefined,{minimumFractionDigits:getPrice(selected)>1000?0:2,maximumFractionDigits:getPrice(selected)>1000?0:2})}</div>
                  <div style={{fontSize:18,color:getChange(selected)>=0?'#22c55e':'#ef4444',fontWeight:600}}>
                    {getChange(selected)>=0?'+':''}{getChange(selected).toFixed(2)} ({getPct(selected)>=0?'+':''}{getPct(selected).toFixed(2)}%)
                  </div>
                </div>
              </div>

              {/* Trade Signal */}
              <div style={{background:'#111827',borderRadius:8,padding:14,marginBottom:16,borderLeft:`4px solid ${sigColor(s.signal.action)}`}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <div>
                    <div style={{fontSize:10,color:'#9ca3af'}}>SIGNAL</div>
                    <div style={{color:sigColor(s.signal.action),fontWeight:700,fontSize:16}}>{s.signal.action}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:10,color:'#9ca3af'}}>CONFIDENCE</div>
                    <div style={{fontWeight:700,fontSize:18}}>{s.signal.confidence}%</div>
                  </div>
                </div>
                <div style={{fontSize:13,color:'#d1d5db',lineHeight:1.5}}>{s.signal.reasoning}</div>
              </div>

              {/* Market vs Stock Context */}
              <div style={{background:'#111827',borderRadius:8,padding:14,marginBottom:16}}>
                <h3 style={{fontSize:13,color:'#9ca3af',margin:'0 0 10px'}}>📊 MARKET vs STOCK CONTEXT</h3>
                <div style={{display:'flex',height:10,borderRadius:5,overflow:'hidden',marginBottom:8}}>
                  <div style={{width:`${s.marketContext.market}%`,background:'linear-gradient(90deg,#3b82f6,#60a5fa)'}}/>
                  <div style={{width:`${s.marketContext.stock}%`,background:'linear-gradient(90deg,#f59e0b,#fbbf24)'}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:10}}>
                  <span style={{color:'#3b82f6'}}>🌊 Market Dynamics: {s.marketContext.market}%</span>
                  <span style={{color:'#f59e0b'}}>🎯 Stock-Specific: {s.marketContext.stock}%</span>
                </div>
                <p style={{fontSize:12,color:'#94a3b8',lineHeight:1.5,margin:0}}>{s.contextNarrative}</p>
              </div>

              {/* Why It's Moving */}
              <div style={{marginBottom:16}}>
                <h3 style={{fontSize:13,color:'#9ca3af',margin:'0 0 10px'}}>🔍 WHY IT'S MOVING</h3>
                {s.attribution.map((a,i) => (
                  <div key={i} style={{background:'#111827',borderRadius:8,padding:10,marginBottom:8}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <span style={{fontWeight:600,fontSize:12}}>{a.factor}</span>
                      <span style={{
                        background: a.pct > 0 ? '#7f1d1d' : '#14532d',
                        color: a.pct > 0 ? '#fca5a5' : '#86efac',
                        padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600
                      }}>{a.pct > 0 ? '+' : ''}{a.pct}%</span>
                    </div>
                    <div style={{fontSize:11,color:'#9ca3af'}}>{a.why}</div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{background:'#111827',borderRadius:8,padding:12,marginBottom:16}}>
                <h3 style={{fontSize:12,color:'#9ca3af',margin:'0 0 6px'}}>📝 Summary</h3>
                <p style={{fontSize:13,color:'#d1d5db',margin:0,lineHeight:1.5}}>{s.summary}</p>
              </div>

              {/* News Sources */}
              <div>
                <h3 style={{fontSize:13,color:'#9ca3af',margin:'0 0 10px'}}>📰 NEWS SOURCES</h3>
                {s.news.map((n,i) => (
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,padding:10,background:i%2===0?'#111827':'transparent',borderRadius:6,marginBottom:4}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:sentColor(n.sent),marginTop:5,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,lineHeight:1.4}}>{n.headline}</div>
                      <div style={{fontSize:10,color:'#6b7280',marginTop:3}}>
                        <a href={n.url} target="_blank" rel="noopener noreferrer" style={{color:'#22d3ee',textDecoration:'none'}}>{n.source}</a>
                        {' '} • {n.age} • Weight: {n.weight}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{textAlign:'center',marginTop:20,fontSize:10,color:'#475569'}}>
            Data as of Feb 5, 2026 • News attribution shows % contribution to move • Not financial advice
          </div>
        </div>
      </div>
    </>
  );
}
