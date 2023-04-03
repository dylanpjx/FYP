import Switches from './Switches';
import {
    Button,
    DialogActions,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import Buttons from './Buttons';
import Leds from './Leds';
import SevenSeg from './SevenSeg';
import { useNavigate } from "react-router-dom";
import FileUpload from './FileUpload';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthProvider';
import axios from 'axios';

const MODULE = 'EE2026'

const Artix7 = () => {
    
    let navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [isAllowed, setIsAllowed] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    
    useEffect(() => {

      let intervalId;
      let events;
      let startDate;
      let endDate;

      const computeTimeRemaining = () => {
        if(!isAllowed) {
          return null;
        }
        const currentDate = new Date();
        const diffInMs = endDate - currentDate;
        const diffInSec = Math.round(diffInMs / 1000);
        setRemainingTime(diffInSec);
        if (remainingTime <= 0) {
          clearInterval(intervalId);
          if(checkUserAccess()){
            intervalId = setInterval(computeTimeRemaining, 1000);
          }
        }
      }

      const checkUserAccess = async () => {
        try {
          const res = await axios.get(`${REACT_APP_BACKEND_URL}/calendar/${MODULE}/${user.group}`);
          events = res.data;
          
          const currentDate = new Date();

          for (const event of events) {
            startDate = new Date(event.start);
            endDate = new Date(event.end);
  
            if (currentDate >= startDate && currentDate <= endDate) {
              setIsAllowed(true);
              return true;
            } else {
              setIsAllowed(false);
              return false;
            }
          }

        } catch (error) {
          console.error(error);
        }
      };
      
      // Call the functions on mounting
      checkUserAccess();
      computeTimeRemaining();

      return () => clearInterval(intervalId);
    }, [remainingTime]);
  

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        navigate("/home");
    };

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

    if (!isAllowed) {
        return (
            <div>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Something went wrong"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Book a session to use
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/home")}
                    >
                    Back to Homepage
                    </Button>
                </DialogActions>
              </Dialog>
            </div>
        );
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
        <p>Remaining time: {formatTime(remainingTime)}</p>
        <Switches switchState={switchState} handleSwitchToggle={handleSwitchToggle}/>
        <Buttons/>
        <Leds ledState={ledState}/>
        <SevenSeg sevenSegItems={sevenSegItems} sevenSegState={sevenSegState}/>
        <FileUpload />
    </main>
    )
}

export default Artix7
