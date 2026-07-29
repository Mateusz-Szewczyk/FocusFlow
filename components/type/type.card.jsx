const { Headline, Label, Note, Numeral } = FF;
ReactDOM.createRoot(document.getElementById('root')).render(
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'30px'}}>
    <div>
      <Label>Next · 18:00</Label>
      <Headline size="l" style={{marginTop:14}}>Review<br/>chapter 3</Headline>
      <Note style={{marginTop:14}}>50 minutes, ending 18:50.</Note>
    </div>
    <div>
      <Label size="lg" tone="secondary">Until 18:50</Label>
      <Numeral size="lg" style={{marginTop:14}}>18:50</Numeral>
      <Numeral size="md" style={{marginTop:16}}>37:48</Numeral>
      <Headline size="s" style={{marginTop:18}}>Today branched.</Headline>
    </div>
  </div>);
