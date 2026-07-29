const { StatusBar, TabBar } = FF;
const tabs = [{value:'today',label:'Today'},{value:'grove',label:'Grove'},{value:'connect',label:'You'}];
ReactDOM.createRoot(document.getElementById('root')).render(
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'30px'}}>
    <div style={{border:'1px solid var(--hairline)',borderRadius:20,overflow:'hidden'}}>
      <StatusBar time="18:12" />
      <div style={{padding:'26px 30px',fontFamily:'var(--font-display)',fontSize:24}}>Light screen</div>
      <TabBar tabs={tabs} current="today" />
    </div>
    <div data-theme="dark" style={{background:'var(--paper)',border:'1px solid var(--hairline)',borderRadius:20,overflow:'hidden'}}>
      <StatusBar time="21:00" />
      <div style={{padding:'26px 30px',fontFamily:'var(--font-display)',fontSize:24,color:'var(--ink-1)'}}>Night screen</div>
      <TabBar tabs={tabs} current="grove" />
    </div>
  </div>);
