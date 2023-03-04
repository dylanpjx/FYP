import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import {
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';
import Buttons from './Buttons';
import Switches from "./Switches";
import Leds from "./Leds";
import React, { useState, useContext, useEffect } from 'react';
import SingleButton from "./SingleButton";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../AuthProvider';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000'
const MODULE = 'EE4218';

const Zedboard = () => {

  let navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [isAllowed, setIsAllowed] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
      const checkUserAccess = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}/calendar/${MODULE}/${user.group}`);
          const events = res.data;

          const currentDate = new Date();
  
          for (const event of events) {
              const startDate = new Date(event.start);
              const endDate = new Date(event.end);
              setIsAllowed(false);
              if (currentDate >= startDate && currentDate <= endDate) {
                  setIsAllowed(true);
                  const diffInMs = endDate - currentDate;
                  const diffInSec = Math.round(diffInMs / 1000);
                  setRemainingTime(diffInSec);
                  return null;
              }
          }
          
        } catch (error) {
          console.error(error);
        }
      };
  
      checkUserAccess();
      // Check every second
      const intervalId = setInterval(checkUserAccess, 1000);
  
      return () => clearInterval(intervalId);
  }, [user, navigate]);
  
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
      <p>Remaining time: {formatTime(remainingTime)}</p>
      <Buttons />
      <div className="ZedboardButtonsContainer">
        {ButtonNames.map((ButtonName) => <SingleButton name={ButtonName} key={ButtonName} />)}
      </div>
      <Switches switchState={switchState} handleSwitchToggle={handleSwitchToggle}/>
      <Leds ledState={ledState}/>
    </div>
  )
}

export default Zedboard;
