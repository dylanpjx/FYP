const Buttons = () => {

  const handleButtonPress = (e,buttonpressed) => {
    e.preventDefault();
    console.log(buttonpressed);
  }

  return (
    <form className="Buttons">
      <div id="buttonContainer">
        <label>BTNU</label>
        <div>
          <button 
          id="UpButton"
          onClick={(e)=>handleButtonPress(e,"BTNU")}>
            <div></div>
          </button>
        </div>
        <label>BTNR</label>
        <div>
          <button
          id="RightButton" 
          onClick={(e)=>handleButtonPress(e,"BTNR")}>
            <div></div>
          </button>
        </div>
        <label>BTND</label>
        <div>
          <button
          id="DownButton" 
          onClick={(e)=>handleButtonPress(e,"BTND")}>
            <div></div>
          </button>
        </div>
        <label>BTNL</label>
        <div>
          <button
          id="LeftButton" 
          onClick={(e)=>handleButtonPress(e,"BTNL")}>
            <div></div>
          </button>
        </div>
        {/* <label>BTNC</label> */}
        <div>
          <button
          id="CentreButton" 
          onClick={(e)=>handleButtonPress(e,"BTNC")}>
            <div></div>
          </button>
        </div>
      </div>      
    </form>
  )
}

export default Buttons
