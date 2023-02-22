import './SingleButton.css';

const handleButtonPress = (e,buttonName,buttonCallback) => {
  e.preventDefault();
  if (buttonCallback) buttonCallback(buttonName,1)
}

const handleButtonRelease = (e,buttonName,buttonCallback) => {
  e.preventDefault();
  if (buttonCallback) buttonCallback(buttonName,0)
}

const SingleButton = ( {name, callback} ) => {
  return (
    <div className="SingleButtonContainer">
      <label>{name}</label>
      <div>
        <button 
        id={name}
        onMouseDown = {(e) => handleButtonPress(e, name , callback)}
        onMouseUp   = {(e) => handleButtonRelease(e, name, callback)}
        >
          <div></div> 
        </button>
      </div>
    </div>
  )
}

export default SingleButton
