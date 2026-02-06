import { useState, useEffect } from 'react';

const STOCKS_DATA = {
  AMZN: {
    name: 'Amazon.com',
    marketContext: { market: 40, stock: 60 }, contextType: 'EARNINGS SHOCK',
    factors: [
      { name: '$200B capex (60% above 2025)', pct: 45, why: 'Massive AI spend spooked investors' },
      { name: 'EPS miss ($1.95 vs $1.97)', pct: 25, why: 'Slight miss, harsh reaction' },
      { name: 'AWS +20% growth strong', pct: -20, why: 'Cloud up 20% providing floor' }
    ],
    signal: 'BUY THE PANIC', confidence: 72,
    summary: 'Crashing on $200B capex shock. AWS crushed it but spending fears dominate.'
  },
  BTCUSD: {
    name: 'Bitcoin USD',
    marketContext: { market: 70, stock: 30 }, contextType: 'CRYPTO CRASH',
    factors: [
      { name: 'Mass liquidation cascade', pct: 45, why: '$1B forced selling' },
      { name: 'ETF institutional exodus', pct: 30, why: '$1.7B weekly outflows' },
      { name: 'RSI 24 oversold', pct: -15, why: 'May support bounce' }
    ],
    signal: 'WAIT', confidence: 40,
    summary: 'Down 44% from ATH. ETF exodus, RSI 24 = deeply oversold.'
  },
  MSTR: {
    name: 'Strategy (MicroStrategy)',
    marketContext: { market: 30, stock: 70 }, contextType: 'LEVERED BTC',
    factors: [
      { name: 'Bitcoin -11% to $64K', pct: 70, why: '1.5-2x levered BTC proxy' },
      { name: 'Analyst cuts (-60%)', pct: 20, why: 'Canaccord $185 from $474' }
    ],
    signal: 'AVOID', confidence: 45,
    summary: 'Destroyed as levered BTC proxy—down 65% from peak.'
  },
  MU: {
    name: 'Micron Technology',
    marketContext: { market: 60, stock: 40 }, contextType: 'AI MEMORY LEADER',
    factors: [
      { name: 'AI memory shortage +90%', pct: 55, why: 'HBM demand exceeding supply' },
      { name: 'Taiwan fab acquisition', pct: 25, why: 'Expanding AI capacity' }
    ],
    signal: 'BUY THE DIP', confidence: 78,
    summary: 'HBM sold out, prices +90%. Best AI memory play.'
  },
  SNDK: {
    name: 'SanDisk Corp',
    marketContext: { market: 30, stock: 70 }, contextType: 'AI STORAGE',
    factors: [
      { name: 'Profit-taking after 1100% run', pct: 50, why: 'Locking massive gains' },
      { name: 'Tech selloff', pct: 30, why: 'High-beta hit hardest' }
    ],
    signal: 'HOLD/TRAIL', confidence: 65,
    summary: 'Up 1100% YTD. Healthy pullback after parabolic run.'
  },
  NVDA: {
    name: 'NVIDIA Corp',
    marketContext: { market: 55, stock: 45 }, contextType: 'MEMORY CRUNCH',
    factors: [
      { name: 'Gaming GPU delay', pct: 40, why: 'Memory shortage forces delays' },
      { name: 'Tech rotation', pct: 35, why: 'High-multiple semis sold' }
    ],
    signal: 'ACCUMULATE', confidence: 75,
    summary: 'No gaming GPU in 2026. -18% from high. Feb 25 earnings key.'
  },
  GOOGL: {
    name: 'Alphabet Inc',
    marketContext: { market: 50, stock: 50 }, contextType: 'POST-EARNINGS',
    factors: [
      { name: 'Capex shock $175-185B', pct: 40, why: '55% above estimates' },
      { name: 'Cloud +48% overlooked', pct: -25, why: 'Best growth ignored' }
    ],
    signal: 'BUY', confidence: 72,
    summary: 'Cloud +48% phenomenal but overshadowed by capex fears.'
  },
  MSFT: {
    name: 'Microsoft Corp',
    marketContext: { market: 60, stock: 40 }, contextType: 'CAPEX CONCERNS',
    factors: [
      { name: 'Post-earnings selloff', pct: 50, why: 'AI spending fears' },
      { name: 'Down 28% from $555', pct: 30, why: 'Tech rotation' }
    ],
    signal: 'BUY', confidence: 70,
    summary: 'Down 28% from high. Cloud $50B milestone ignored.'
  },
  AAPL: {
    name: 'Apple Inc',
    marketContext: { market: 30, stock: 70 }, contextType: 'SAFE HAVEN',
    factors: [
      { name: 'Flight to quality', pct: 50, why: 'Rotating to stable megacap' },
      { name: 'No capex overhang', pct: 30, why: 'AI via partnerships' }
    ],
    signal: 'HOLD', confidence: 68,
    summary: 'Outperforms during $1.2T tech wipeout. Safe haven.'
  },
  TSLA: {
    name: 'Tesla Inc',
    marketContext: { market: 40, stock: 60 }, contextType: 'SALES DECLINE',
    factors: [
      { name: 'EU sales collapse', pct: 45, why: 'France -42%, Norway -88%' },
      { name: 'US sales -17%', pct: 30, why: 'Competition growing' }
    ],
    signal: 'AVOID', confidence: 55,
    summary: 'EU sales crater. 377x P/E assumes robotics success.'
  },
  META: {
    name: 'Meta Platforms',
    marketContext: { market: 50, stock: 50 }, contextType: 'CAPEX FEARS',
    factors: [
      { name: 'AI capex $115-135B', pct: 45, why: 'Spending scaring investors' },
      { name: 'Ad strength ignored', pct: -20, why: 'Core business crushing' }
    ],
    signal: 'BUY', confidence: 70,
    summary: 'Down 10% despite crushing Q4. Capex fears overblown.'
  },
  PLTR: {
    name: 'Palantir Tech',
    marketContext: { market: 40, stock: 60 }, contextType: 'POST-CRASH',
    factors: [
      { name: 'Software oversold bounce', pct: 50, why: 'Sector -28% from highs' },
      { name: 'High P/E risk (221x)', pct: 35, why: 'Priced for perfection' }
    ],
    signal: 'AVOID', confidence: 58,
    summary: 'Bouncing after -12% crash. 221x P/E still extreme.'
  },
  TSM: {
    name: 'Taiwan Semiconductor',
    marketContext: { market: 55, stock: 45 }, contextType: 'FOUNDRY MONOPOLY',
    factors: [
      { name: 'Tech selloff', pct: 45, why: 'Semis sold across board' },
      { name: 'NVIDIA customer growth', pct: -15, why: 'AI demand tailwind' }
    ],
    signal: 'ACCUMULATE', confidence: 75,
    summary: 'Foundry monopoly, essential AI infrastructure.'
  },
  AVGO: {
    name: 'Broadcom Inc',
    marketContext: { market: 45, stock: 55 }, contextType: 'CUSTOM AI CHIPS',
    factors: [
      { name: 'Google capex boost', pct: 40, why: '$175-185B benefits AVGO' },
      { name: '200-day MA support', pct: 25, why: 'Bounced off key level' }
    ],
    signal: 'BUY', confidence: 70,
    summary: 'Google capex bullish for custom AI chips.'
  },
  CRWD: {
    name: 'CrowdStrike',
    marketContext: { market: 35, stock: 65 }, contextType: 'CYBERSECURITY',
    factors: [
      { name: 'Software oversold bounce', pct: 45, why: 'Sector -28% from highs' },
      { name: 'ARR growth 50%+', pct: 35, why: 'Strong fundamentals' }
    ],
    signal: 'BUY', confidence: 72,
    summary: 'Cybersecurity leader with 50%+ ARR growth.'
  },
  PANW: {
    name: 'Palo Alto Networks',
    marketContext: { market: 50, stock: 50 }, contextType: 'CONSOLIDATION',
    factors: [
      { name: 'China ban uncertainty', pct: 30, why: 'Geopolitical overhang' },
      { name: 'Strong fundamentals', pct: -25, why: 'Beat-and-raise supports' }
    ],
    signal: 'HOLD', confidence: 60,
    summary: 'Awaiting catalyst. China ban fears weighing.'
  },
  PYPL: {
    name: 'PayPal Holdings',
    marketContext: { market: 20, stock: 80 }, contextType: 'CAPITULATION',
    factors: [
      { name: 'CEO transition', pct: 45, why: 'New CEO March 1' },
      { name: 'Deep value 8x P/E', pct: -20, why: '$5B FCF ignored' }
    ],
    signal: 'SPEC BUY', confidence: 60,
    summary: 'Near 52-week low. 8x P/E, $5B FCF—capitulation pricing.'
  },
  QQQ: {
    name: 'Invesco QQQ',
    marketContext: { market: 90, stock: 10 }, contextType: 'TECH INDEX',
    factors: [
      { name: 'Big Tech capex fears', pct: 50, why: 'GOOGL, MSFT, AMZN spooked market' },
      { name: 'Growth rotation', pct: 35, why: 'Value over growth' }
    ],
    signal: 'NIBBLE', confidence: 65,
    summary: '$1.2T tech wipeout this week. Capex fears dominate.'
  }
};

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch('/api/stocks');
        const data = await res.json();
        const merged = (data.stocks || []).map(s => ({ ...s, ...(STOCKS_DATA[s.symbol] || {}) }));
        setStocks(merged);
      } catch (e) {
        setStocks(Object.entries(STOCKS_DATA).map(([symbol, d]) => ({ symbol, ...d })));
      }
      setLastUpdate(new Date());
      setLoading(false);
    };
    fetchStocks();
    const i = setInterval(fetchStocks, 60000);
    return () => clearInterval(i);
  }, []);

  const sigColor = (s) => {
    if (!s) return '#6b7280';
    if (s.includes('BUY') || s.includes('ACCUMULATE')) return '#22c55e';
    if (s.includes('AVOID')) return '#ef4444';
    if (s.includes('SPEC')) return '#f59e0b';
    return '#eab308';
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'#0f172a',color:'white'}}>Loading...</div>;

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f172a,#1e293b)',padding:16}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <h1 style={{color:'white',fontSize:22,marginBottom:4}}>📈 Stock Dashboard</h1>
        <p style={{color:'#64748b',fontSize:12,marginBottom:16}}>Updated: {lastUpdate?.toLocaleTimeString()} • Tap for analysis</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:12}}>
          {stocks.map(s => {
            const up = (s.change||0) >= 0;
            const exp = expanded === s.symbol;
            const sc = sigColor(s.signal);
            return (
              <div key={s.symbol} onClick={() => setExpanded(exp ? null : s.symbol)} style={{background:'#1e293b',borderRadius:12,padding:12,cursor:'pointer',border:`2px solid ${sc}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                  <span style={{color:'white',fontWeight:'bold',fontSize:15}}>{s.symbol}</span>
                  {s.signal && <span style={{fontSize:9,padding:'2px 6px',borderRadius:4,background:sc,color:'white',fontWeight:600}}>{s.signal}</span>}
                </div>
                <div style={{color:'white',fontSize:19,fontWeight:'bold'}}>${s.price?.toLocaleString(undefined,{minimumFractionDigits:s.price>1000?0:2,maximumFractionDigits:s.price>1000?0:2})}</div>
                <div style={{color:up?'#22c55e':'#ef4444',fontSize:13,marginBottom:6}}>{up?'+':''}{s.change?.toFixed(2)} ({up?'+':''}{s.changePercent?.toFixed(2)}%)</div>
                {s.contextType && <div style={{fontSize:9,color:'#94a3b8',background:'#334155',padding:'2px 6px',borderRadius:4,display:'inline-block',marginBottom:6}}>{s.contextType}</div>}
                {s.marketContext && (
                  <div style={{marginBottom:6}}>
                    <div style={{display:'flex',height:6,borderRadius:3,overflow:'hidden'}}>
                      <div style={{width:`${s.marketContext.market}%`,background:'#3b82f6'}}/>
                      <div style={{width:`${s.marketContext.stock}%`,background:'#f59e0b'}}/>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:9,marginTop:2}}>
                      <span style={{color:'#3b82f6'}}>Mkt {s.marketContext.market}%</span>
                      <span style={{color:'#f59e0b'}}>Stock {s.marketContext.stock}%</span>
                    </div>
                  </div>
                )}
                {s.confidence && <div style={{fontSize:10,color:'#94a3b8'}}>Confidence: <span style={{color:'white',fontWeight:600}}>{s.confidence}%</span></div>}
                {exp && (
                  <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid #334155'}}>
                    {s.summary && <div style={{fontSize:11,color:'#d1d5db',marginBottom:10,lineHeight:1.4}}>{s.summary}</div>}
                    {s.factors && (
                      <div>
                        <div style={{fontSize:10,color:'#64748b',marginBottom:4}}>WHY IT'S MOVING:</div>
                        {s.factors.map((f,i) => (
                          <div key={i} style={{background:'#111827',borderRadius:6,padding:8,marginBottom:4}}>
                            <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                              <span style={{fontSize:11,fontWeight:600,color:'white'}}>{f.name}</span>
                              <span style={{fontSize:10,padding:'1px 5px',borderRadius:3,background:f.pct>0?'#7f1d1d':'#14532d',color:f.pct>0?'#fca5a5':'#86efac'}}>{f.pct>0?'+':''}{f.pct}%</span>
                            </div>
                            <div style={{fontSize:10,color:'#9ca3af'}}>{f.why}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
