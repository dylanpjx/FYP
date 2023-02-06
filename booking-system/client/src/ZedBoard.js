import Buttons from "./Buttons";
import Switches from "./Switches";
import Leds from "./Leds";
import { useState } from 'react';

const handleButtonPress = (e,buttonpressed) => {
  e.preventDefault();
  console.log(buttonpressed);
}

/*
Table 12 - Push Button Connections
Signal Name Subsection Zynq pin
BTNU PL T18
BTNR PL R18
BTND PL R16
BTNC PL P16
BTNL PL N15
PB1 PS D13 (MIO 50)
PB2 PS C10 (MIO 51)

Table 13 - DIP Switch Connections
Signal Name Zynq pin
SW0 F22
SW1 G22
SW2 H22
SW3 F21
SW4 H19
SW5 H18
SW6 H17
SW7 M15

Table 14 - LED Connections
Signal Name Subsection Zynq pin
LD0 PL T22
LD1 PL T21
LD2 PL U22
LD3 PL U21
LD4 PL V22
LD5 PL W22
LD6 PL U19
LD7 PL U14
LD9 PS D5 (MIO7)
*/
const ZedBoard = () => {

  const [ledState,setLedState]=useState([
    {
      id:0,
      state:false,
      name:"LD0",
    },
    {
      id:1,
      state:false,
      name:"LD1",
    },
    {
      id:2,
      state:false,
      name:"LD2",
    },
    {
      id:3,
      state:false,
      name:"LD3",
    },
    {
      id:4,
      state:false,
      name:"LD4",
    },
    {
      id:5,
      state:false,
      name:"LD5",
    },
    {
      id:6,
      state:false,
      name:"LD6",
    },
    {
      id:7,
      state:false,
      name:"LD7",
    },
    {
      id:8,
      state:false,
      name:"LD9",
    }
  ]);
  const [switchState, setSwitchState] = useState([
    {
      id:0,
      state:false,
      name:"SW0",
    },
    {
      id:1,
      state:false,
      name:"SW1",
    },
    {
      id:2,
      state:false,
      name:"SW2",
    },
    {
      id:3,
      state:false,
      name:"SW3",
    },
    {
      id:4,
      state:false,
      name:"SW4",
    },
    {
      id:5,
      state:false,
      name:"SW5",
    },
    {
      id:6,
      state:false,
      name:"SW6",
    },
    {
      id:7,
      state:false,
      name:"SW7",
    }
  ]);

  const handleSwitchToggle = (id) => {
    const switchItems = switchState.map(switchItem => switchItem.id === id?
    {...switchItem, state: !switchItem.state}: switchItem);
    setSwitchState(switchItems);
    handleLedState(id);
  }

  const handleLedState = id => {
    const ledItems = ledState.map(ledItem => ledItem.id === id?
      {...ledItem, state:!ledItem.state}: ledItem);
    setLedState(ledItems);
  }

  return (
    <main>
      <h3>ZedBoard</h3>
      <Buttons />
      <div className="ZedboardButtonsContainer">
        <div>
          <label>PB1</label>
          <div>
            <button 
            id="PB1"
            onClick={(e)=>handleButtonPress(e,"PB1")}>
              <div></div>
            </button>
          </div>
        </div>
        <div>
          <label>PB2</label>
          <div>
            <button 
            id="PB2"
            onClick={(e)=>handleButtonPress(e,"PB2")}>
              <div></div>
            </button>
          </div>
        </div>
      </div>
      <Switches switchState={switchState} handleSwitchToggle={handleSwitchToggle}/>
      <Leds ledState={ledState}/>
    </main>
  )
}

export default ZedBoard
