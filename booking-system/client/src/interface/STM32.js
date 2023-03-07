import SingleButton from "./SingleButton";
import {
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthProvider';

const BoardButtonNames = ["USER","RESET"]
const OrientationButtonNames = ["X-","X+","Y-","Y+","Z-","Z+"]
const BACKEND_URL = 'http://localhost:5000';
const MODULE = 'EE2028';

const sendSTM32 = async (buttonName, buttonState) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      BACKEND_URL+'/stm32', 
      { button: buttonName, value: buttonState },
      { headers: {"Authorization" : `Bearer ${token}`} }
      
    );
    console.log(buttonName, buttonState, response.data)
  } catch (error) {
    console.log(error);
  }
};

const STM32 = () => {
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
        const res = await axios.get(`${BACKEND_URL}/calendar/${MODULE}/${user.group}`);
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
    <main>
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
          STM32
      </h3>
      <p>Remaining time: {formatTime(remainingTime)}</p>
      
      <div className="STM32BoardButtonsContainer">
        {BoardButtonNames.map((ButtonName) => <SingleButton name={ButtonName} key={ButtonName} callback={sendSTM32}/>)}
      </div>
      <div className="STM32OrientationButtonsContainer">
        {OrientationButtonNames.map((ButtonName) => <SingleButton name={ButtonName} key={ButtonName} callback={sendSTM32}/>)}
      </div>
    </main>
  )
}

export default STM32
