const Leds = ({ ledState }) => {

  return (
    <div className="Leds">
      <ul>
        {ledState.map((ledItem) =>(
        <li 
          key={ledItem.name} 
        >
          <label>{ledItem.name}</label>
          {ledItem.state && <div className="ledIconOn"></div>}
          {!ledItem.state && <div className="ledIconOff"></div>}
        </li>
        ))}
      </ul>
    </div>
  )
}

export default Leds
