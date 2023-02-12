import Button from '@mui/material/Button';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import Buttons from "./Buttons";
import Switches from "./Switches";
import Leds from "./Leds";
import React, { useState } from 'react';
import SingleButton from "./SingleButton";
import { useNavigate } from "react-router-dom";

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
const Zedboard = () => {

  let navigate = useNavigate();

  const ButtonNames = ["PB1","PB2"];

  const switchArr = [];
  for(let i=0; i<=7; i++){
    switchArr.push({
      id: i,
      state: false,
      name: `SW${i}`
    });
  }

  const ledArr = [];
  for (let i=0; i<=9; i++){
    if(i !== 8){
      ledArr.push({
      id: i,
      state: false,
      name: `LD${i}`
      });
    }
  }

  const [ledState,setLedState]=useState(ledArr);
  const [switchState, setSwitchState] = useState(switchArr);

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
    <div>
      <Button
            variant="contained"
            onClick={() => navigate("/home")}
            startIcon={ <ArrowLeftIcon /> }
        >
          Back
      </Button>
      <h3
          style={{textAlign: "center"}}
      >
          Zedboard
      </h3>

      <Buttons />

      <div className="ZedboardButtonsContainer">
        {ButtonNames.map((ButtonName) => <SingleButton name={ButtonName} key={ButtonName}/>)}
      </div>
      <Switches switchState={switchState} handleSwitchToggle={handleSwitchToggle}/>
      <Leds ledState={ledState}/>
    </div>
  )
}

export default Zedboard;
