
const handleButtonPress = (e,buttonpressed) => {
  e.preventDefault();
  console.log(buttonpressed);
}

const STM32 = () => {
  return (
    <main>
      <h3>STM32</h3>
      <div className="STM32ButtonsContainer">
        <div>
          <label>USER</label>
          <div>
            <button 
            id="USER"
            onClick={(e)=>handleButtonPress(e,"USER")}>
              <div></div>
            </button>
          </div>
        </div>
        <div>
          <label>RESET</label>
          <div>
            <button 
            id="RESET"
            onClick={(e)=>handleButtonPress(e,"RESET")}>
              <div></div>
            </button>
          </div>
        </div>
        <div>
          <label>Tilt Forward</label>
          <div>
            <button 
            id="TiltForward"
            onClick={(e)=>handleButtonPress(e,"TiltForward")}>
              <div></div>
            </button>
          </div>
        </div>
        <div>
          <label>Tilt Backward</label>
          <div>
            <button 
            id="TiltBackward"
            onClick={(e)=>handleButtonPress(e,"TiltBackward")}>
              <div></div>
            </button>
          </div>
        </div>
        <div>
          <label>Tilt Left</label>
          <div>
            <button 
            id="TiltLeft"
            onClick={(e)=>handleButtonPress(e,"TiltLeft")}>
              <div></div>
            </button>
          </div>
        </div>
        <div>
          <label>Tilt Right</label>
          <div>
            <button 
            id="TiltRight"
            onClick={(e)=>handleButtonPress(e,"TiltRight")}>
              <div></div>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default STM32
