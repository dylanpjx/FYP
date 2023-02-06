const Switches = ({ switchState, handleSwitchToggle }) => {
  return (
    <div className="Switches">
      <ul>
        {switchState.map(({name, id})=>(
        <li className="SwitchItem" key = {name}>
          <label>{name}</label>
          <input
            type = "checkbox"
            className="check_box"
            id = {`checkbox`+id}
            onChange={()=>handleSwitchToggle(id)}
          >
          </input>
          <label htmlFor={`checkbox`+id} target="_blank"></label>
        </li>
        ))}
      </ul>
    </div>
  )
}

export default Switches