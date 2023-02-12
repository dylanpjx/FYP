import Switches from './Switches';
import Button from '@mui/material/Button';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import Buttons from './Buttons';
import Leds from './Leds';
import SevenSeg from './SevenSeg';
import { useNavigate } from "react-router-dom";
import FileUpload from './FileUpload';
import {useState} from 'react';

const Artix7 = () => {
    
    let navigate = useNavigate();

    const switchArr = [];
    for (let i = 0; i <= 15; ++i) {
        switchArr.push({
            id: i,
            state: false,
            name: `SW${i}`
        });
    }
    const [switchState, setSwitchState] = useState(switchArr);

    const ledArr = [];
    for (let i = 0; i <= 15; ++i) {
        ledArr.push({
            id: i,
            state: false,
            name: `LED${i}`
        });
    }
    const [ledState,setLedState] = useState(ledArr);
    
    const cathodes = ["CF", "CA", "CB", "CG", "CE", "CC", "CD", "DP"]
    const [sevenSegItems, setSevenSegItems] = useState(
        [...Array(4).keys()].flatMap(i =>
            cathodes.map(node => ({
              name: `AN${i}`,
              state: true,
              node
            }))
          )
        );

    const anodeArr = [];
    for (let i = 0; i <= 3; ++i) {
        anodeArr.push({
            name: `AN${i}`,
            state: true
        });
    }
    const [sevenSegState,setSevenSegState] = useState(anodeArr)

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
    <main className='Artix7'>
        <Button
            variant="contained"
            onClick={() => navigate("/home")}
            startIcon={ <ArrowLeftIcon /> }
        >
        Back
        </Button>
        <h3
        style={{textAlign: "center"}}
        >Artix7</h3>
        <Switches switchState={switchState} handleSwitchToggle={handleSwitchToggle}/>
        <Buttons/>
        <Leds ledState={ledState}/>
        <SevenSeg sevenSegItems={sevenSegItems} sevenSegState={sevenSegState}/>
        <FileUpload />
    </main>
    )
}

export default Artix7
