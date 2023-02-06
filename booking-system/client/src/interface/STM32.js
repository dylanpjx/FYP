import SingleButton from "./SingleButton";

const ButtonNames = ["USER","RESET","TiltForward","TiltBackward","TiltLeft","TiltRight"]

const STM32 = () => {
  return (
    <main>
      <h3>STM32</h3>
      <div className="STM32ButtonsContainer">
        {ButtonNames.map((ButtonName) => <SingleButton name={ButtonName} key={ButtonName}/>)}
      </div>
    </main>
  )
}

export default STM32
