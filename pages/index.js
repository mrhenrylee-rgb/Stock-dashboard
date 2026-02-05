import { useState, useEffect } from 'react';

const NEWS = {
  AMZN: { factors: [['$200B capex shock', 45], ['AWS growth', -20], ['EPS miss', 25]], signal: 'BUY DIP' },
  BTCUSD: { factors: [['Liquidations', 45], ['ETF outflows', 30], ['Oversold', -15]], signal: 'WAIT' },
  MSTR: { factors: [['Bitcoin crash', 70], ['Analyst cuts', 20]], signal: 'AVOID' },
  MU: { factors: [['HBM shortage', 55], ['Fab expansion', 25]], signal: 'BUY' },
  SNDK: { factors: [['Profit-taking', 50], ['Tech selloff', 30]], signal: 'HOLD' },
  NVDA: { factors: [['GPU delay fears', 40], ['Sector rotation', 35]], signal: 'BUY' },
  GOOGL: { factors: [['Capex concerns', 40], ['Cloud growth', -25]], signal: 'BUY' },
  MSFT: { factors: [['Post-earnings drift', 50], ['Cloud strong', -15]], signal: 'BUY' },
  AAPL: { factors: [['Flight to quality', 50], ['No capex fears', 30]], signal: 'HOLD' },
  TSLA: { factors: [['EU sales collapse', 45], ['US weakness', 30]], signal: 'AVOID' },
  META: { factors: [['Capex fears', 45], ['Ad strength', -20]], signal: 'BUY' },
  PLTR: { factors: [['Software selloff', 50], ['High P/E risk', 35]], signal: 'AVOID' },
  TSM: { factors: [['Tech selloff', 45], ['NVIDIA growth', -15]], signal: 'BUY' },
  AVGO: { factors: [['Google capex', 40], ['Tech weakness', -30]], signal: 'BUY' },
  CRWD: { factors: [['Oversold bounce', 45], ['ARR growth', 35]], signal: 'BUY' },
  PANW: { factors: [['China ban fears', 30], ['Fundamentals', -25]], signal: 'HOLD' },
  PYPL: { factors: [['CEO transition', 45], ['Deep value', -20]], signal: 'SPEC BUY' },
  QQQ: { factors: [['Capex fears', 50], ['Rotation out', 35]], signal: 'NIBBLE' },
};

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetchStocks = async () => {
    try {
      const res = await fetch('/api/stocks');
      const data = await res.json();
      setStocks(data.stocks || []);
      setLastUpdate(new Date());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  const sigColor = (s) => s?.includes('BUY') ? '#22c55e' : s?.includes('AVOID') ? '#ef4444' : '#eab308';

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'#0f172a',color:'white'}}>Loading...</div>;

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',padding:16}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <h1 style={{color:'white',fontSize:24,marginBottom:8}}>Stock Dashboard</h1>
        <p style={{color:'#94a3b8',fontSize:14,marginBottom:16}}>Updated: {lastUpdate?.toLocaleTimeString()}</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
          {stocks.map(s => {
            const a = NEWS[s.symbol];
            const up = s.change >= 0;
            const exp = expanded === s.symbol;
            return (
              <div key={s.symbol} onClick={() => setExpanded(exp ? null : s.symbol)}
                style={{background:'#1e293b',borderRadius:12,padding:12,cursor:'pointer',border:a?'2px solid '+sigColor(a.signal):'1px solid #334155'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <span style={{color:'white',fontWeight:'bold'}}>{s.symbol}</span>
                  {a && <span style={{fontSize:10,padding:'2px 6px',borderRadius:4,background:sigColor(a.signal),color:'white'}}>{a.signal}</span>}
                </div>
                <div style={{color:'white',fontSize:20,fontWeight:'bold'}}>${s.price?.toFixed(2)}</div>
                <div style={{color:up?'#22c55e':'#ef4444',fontSize:14}}>{up?'+':''}{s.change?.toFixed(2)} ({up?'+':''}{s.changePercent?.toFixed(2)}%)</div>
                {s.afterHours && <div style={{color:'#94a3b8',fontSize:11,marginTop:4}}>AH: ${s.afterHours.price?.toFixed(2)}</div>}
                {exp && a && (
                  <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid #334155'}}>
                    {a.factors.map(([n,p],i) => (
                      <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#94a3b8'}}>
                        <span>{n}</span><span style={{color:p>0?'#ef4444':'#22c55e'}}>{p>0?'+':''}{p}%</span>
                      </div>
                    ))}
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
