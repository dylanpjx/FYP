import Switches from './Switches';
import Buttons from './Buttons';
import Leds from './Leds';
import SevenSeg from './SevenSeg';
import FileUpload from './FileUpload';
import {useState} from 'react';

const Artix7 = () => {

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
        },
        {
          id:8,
          state:false,
          name:"SW8",
        },
        {
          id:9,
          state:false,
          name:"SW9",
        },
        {
          id:10,
          state:false,
          name:"SW10",
        },
        {
          id:11,
          state:false,
          name:"SW11",
        },
        {
          id:12,
          state:false,
          name:"SW12",
        },
        {
          id:13,
          state:false,
          name:"SW13",
        },
        {
          id:14,
          state:false,
          name:"SW14",
        },
        {
          id:15,
          state:false,
          name:"SW15",
        }
      ]);
    const [ledState,setLedState]=useState([
    {
        id:0,
        state:false,
        name:"LED0",
    },
    {
        id:1,
        state:false,
        name:"LED1",
    },
    {
        id:2,
        state:false,
        name:"LED2",
    },
    {
        id:3,
        state:false,
        name:"LED3",
    },
    {
        id:4,
        state:false,
        name:"LED4",
    },
    {
        id:5,
        state:false,
        name:"LED5",
    },
    {
        id:6,
        state:false,
        name:"LED6",
    },
    {
        id:7,
        state:false,
        name:"LED7",
    },
    {
        id:8,
        state:false,
        name:"LED8",
    },
    {
        id:9,
        state:false,
        name:"LED9",
    },
    {
        id:10,
        state:false,
        name:"LED10",
    },
    {
        id:11,
        state:false,
        name:"LED11",
    },
    {
        id:12,
        state:false,
        name:"LED12",
    },
    {
        id:13,
        state:false,
        name:"LED13",
    },
    {
        id:14,
        state:false,
        name:"LED14",
    },
    {
        id:15,
        state:false,
        name:"LED15",
    }
    ]);
    const [sevenSegItems, setSevenSegItems] = useState([
    {
        name:"AN0",
        state:true,
        node:"CF",
    },
    {
        name:"AN0",
        state:true,
        node:"CA",
    },
    {
        name:"AN0",
        state:true,
        node:"CB",
    },
    {
        name:"AN0",
        state:true,
        node:"CG",
    },
    {
        name:"AN0",
        state:true,
        node:"CE",
    },
    {
        name:"AN0",
        state:true,
        node:"CC",
    },
    {
        name:"AN0",
        state:true,
        node:"CD",
    },
    {
        name:"AN0",
        state:true,
        node:"DP",
    },
    {
        name: "AN1",
        state:true,
        node:"CF",
    },
    {
        name: "AN1",
        state:true,
        node:"CA",
    },
    {
        name: "AN1",
        state:true,
        node:"CB",
    },
    {
        name: "AN1",
        state:true,
        node:"CG",
    },
    {
        name: "AN1",
        state:true,
        node:"CE",
    },
    {
        name: "AN1",
        state:true,
        node:"CC",
    },
    {
        name: "AN1",
        state:true,
        node:"CD",
    },
    {
        name: "AN1",
        state:true,
        node:"DP",
    },
    {
        name: "AN2",
        state:true,
        node:"CF",
    },
    {
        name: "AN2",
        state:true,
        node:"CA",
    },
    {
        name: "AN2",
        state:true,
        node:"CB",
    },
    {
        name: "AN2",
        state:true,
        node:"CG",
    },
    {
        name: "AN2",
        state:true,
        node:"CE",
    },
    {
        name: "AN2",
        state:true,
        node:"CC",
    },
    {
        name: "AN2",
        state:true,
        node:"CD",
    },
    {
        name: "AN2",
        state:true,
        node:"DP",
    },
    {
        name: "AN3",
        state:true,
        node:"CF",
    },
    {
        name: "AN3",
        state:true,
        node:"CA",
    },
    {
        name: "AN3",
        state:true,
        node:"CB",
    },
    {
        name: "AN3",
        state:true,
        node:"CG",
    },
    {
        name: "AN3",
        state:true,
        node:"CE",
    },
    {
        name: "AN3",
        state:true,
        node:"CC",
    },
    {
        name: "AN3",
        state:true,
        node:"CD",
    },
    {
        name: "AN3",
        state:true,
        node:"DP",
    },
    ])
    const [sevenSegState,setSevenSegState] = useState([
    {
        name:"AN0",
        state: true,
    },
    {
        name:"AN1",
        state: true,
    },
    {
        name:"AN2",
        state: true,
    },
    {
        name:"AN3",
        state: true,
    }
    ])

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
        <Switches switchState = {switchState} handleSwitchToggle = {handleSwitchToggle}/>
        <Buttons/>
        <Leds ledState={ledState}/>
        <SevenSeg sevenSegItems={sevenSegItems} sevenSegState={sevenSegState}/>
        <FileUpload />
    </main>
    )
}

export default Artix7