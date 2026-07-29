const { StatRow, BulletItem, Timeline, Countdown } = FF;
ReactDOM.createRoot(document.getElementById('root')).render(
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'34px'}}>
    <div>
      <Timeline items={[
        {time:'08:30',name:'Rewrite lecture notes',state:'done'},
        {time:'10:00',name:'Problem set 6',state:'done'},
        {time:'18:00',name:'Review chapter 3',state:'now'},
        {time:'19:00',name:'Free time'}]} />
      <Countdown text="in 12 min" seconds={720} />
    </div>
    <div>
      <StatRow label="Height" value="2h 30m kept" />
      <StatRow label="Leaves" value="3 things finished" />
      <StatRow label="Colour" value="all of your plan" last />
      <div style={{marginTop:10}}>
        <BulletItem>Calls, Maps, bank and 2FA stay open.</BulletItem>
        <BulletItem tone="caution">Thursday runs three hours without a break.</BulletItem>
      </div>
    </div>
  </div>);
