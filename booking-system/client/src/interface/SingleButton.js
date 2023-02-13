import './SingleButton.css';

const handleButtonPress = (e,buttonpressed) => {
  e.preventDefault();
  console.log(buttonpressed);
}

const SingleButton = ( {name} ) => {
  return (
    <div className="SingleButtonContainer">
      <label>{name}</label>
      <div>
        <button 
        id={name}
        onClick={(e)=>handleButtonPress(e,{name})}>
          <div></div>
        </button>
      </div>
    </div>
  )
}

export default SingleButton
