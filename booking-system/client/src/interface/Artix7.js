import Switches from './Switches';
import Buttons from './Buttons';
import Leds from './Leds';
import SevenSeg from './SevenSeg';
import FileUpload from './FileUpload';
import {useState} from 'react';

const Artix7 = () => {

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
        <h3>Artix7</h3>
        <Switches switchState={switchState} handleSwitchToggle={handleSwitchToggle}/>
        <Buttons/>
        <Leds ledState={ledState}/>
        <SevenSeg sevenSegItems={sevenSegItems} sevenSegState={sevenSegState}/>
        <FileUpload />
    </main>
    )
}

export default Artix7
