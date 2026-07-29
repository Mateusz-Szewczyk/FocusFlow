const { Button, Chip, SegmentedControl, Rule } = FF;
function Demo(){
  const [seg, setSeg] = React.useState('week');
  const [chip, setChip] = React.useState('today');
  return (
    <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:'34px',alignItems:'start'}}>
      <div style={{display:'flex',flexDirection:'column',gap:'9px'}}>
        <Button>Start</Button>
        <Button variant="quiet">Finished early</Button>
        <Button variant="tiny">Not now</Button>
        <Button variant="inline">ChatGPT proposed 26 blocks · review</Button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'18px'}}>
        <div style={{display:'flex',gap:'7px',flexWrap:'wrap'}}>
          {['today','plan','grove','share'].map(v =>
            <Chip key={v} selected={chip===v} onClick={()=>setChip(v)}>{v}</Chip>)}
        </div>
        <SegmentedControl value={seg} onChange={setSeg} options={[
          {value:'week',label:'Week'},{value:'month',label:'Month'},{value:'year',label:'Year'}]} />
        <div>
          <div className="mono">above the rule</div>
          <Rule gap={18} />
          <div className="mono">below the rule</div>
        </div>
      </div>
    </div>);
}
ReactDOM.createRoot(document.getElementById('root')).render(<Demo />);
