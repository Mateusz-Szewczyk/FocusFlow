const { Tree, Grove, BreathRing, ShareArt } = FF;
ReactDOM.createRoot(document.getElementById('root')).render(
  <div style={{display:'grid',gridTemplateColumns:'110px 1fr 150px 130px',gap:'22px',alignItems:'center'}}>
    <div><Tree stage={4} green={3} size={1.5} seed={12} /><div className="mono" style={{textAlign:'center'}}>tree</div></div>
    <div><Grove view="week" /><div className="mono" style={{textAlign:'center',marginTop:6}}>grove · week</div></div>
    <div><BreathRing size={130} /><div className="mono" style={{textAlign:'center'}}>breath ring</div></div>
    <div><ShareArt format="wide" title="2026" subtitle="208 days" /><div className="mono" style={{textAlign:'center',marginTop:6}}>share art</div></div>
  </div>);
