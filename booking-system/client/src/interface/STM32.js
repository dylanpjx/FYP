import {
  Button,
  Grid,
  Box,
  Typography,
  Slider,
  Paper,
  Container,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../AuthProvider';
// import STM32Board from '../images/EE2028.PNG';

import LoadingScreen from './LoadingScreen';
import NotAllowed from './NotAllowed';

const BACKEND_URL = 'http://localhost:5000';
const MODULE = 'EE2028';

const sendSTM32 = async (buttonName, buttonState) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      BACKEND_URL+'/stm32', 
      { button: buttonName, value: buttonState }
    );
    console.log(buttonName, buttonState, response.data)
  } catch (error) {
    console.log(error);
  }
};

const cos = reading => {
  return Math.cos(reading * Math.PI/180);
}

const sin = reading => {
  return Math.sin(reading * Math.PI/180);
}

//a=yaw, B=pitch, y=roll
const getAcclerometerValues = (a, B, y) => {
  const gravitationalPull = [0,0,9.81];
  const rotationMatrix = [
  [cos(a)*cos(B), cos(a)*sin(B)*sin(y) - sin(a)*cos(y), cos(a)*sin(B)*cos(y) + sin(a)*sin(y)],
  [sin(a)*cos(B), sin(a)*sin(B)*sin(y) + cos(a)*cos(y), cos(a)*sin(B)*sin(y) - cos(a)*sin(y)],
  [-sin(B), cos(B)*sin(y), cos(B)*cos(y)]
  ];

  function multiply(mat1, mat2)
  {
    let res = [];
    let temp = 0;
      for (let i = 0; i < mat1.length; i++) {
          for (let j = 0; j < mat2.length; j++) {
              temp += mat1[i][j]*mat2[j];
          }
          res.push(Math.round(temp * 1000));
          temp = 0;
      }
    return res;
  }

  const acc = multiply(rotationMatrix,gravitationalPull);
  console.log(acc);
  return acc;
}

const STM32 = () => {
  let navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [isAllowed, setIsAllowed] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [events, setEvents] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(true);

  let intervalRef = useRef();

  const handlePitchChange = async (event, newValue) => {
    setPitch(newValue);
    const acc = getAcclerometerValues(yaw,newValue,roll);
    try{
      const res = await axios.post(`${BACKEND_URL}/stm32`, 
      { button: "SENSOR", value: acc });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRollChange = async (event, newValue) => {
    setRoll(newValue);
    const acc = getAcclerometerValues(yaw,pitch,newValue);
    try{
      const res = await axios.post(`${BACKEND_URL}/stm32`, 
      { button: "SENSOR", value: acc });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleYawChange = async (event, newValue) => {
    setYaw(newValue);
    const acc = getAcclerometerValues(newValue,pitch,roll);
    try{
      const res = await axios.post(`${BACKEND_URL}/stm32`, 
      { button: "SENSOR", value: acc });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleButtonPress = (e,buttonName,buttonCallback) => {
    e.preventDefault();
    if (buttonCallback) buttonCallback(buttonName,1)
  }
  
  const handleButtonRelease = (e,buttonName,buttonCallback) => {
    e.preventDefault();
    if (buttonCallback) buttonCallback(buttonName,0)
  }

  const computeTimeRemaining = (endDate) => {
    const currentDate = new Date();
    let diffInMs;
    if(endDate === undefined){
      diffInMs = end - currentDate;
    } else {
      diffInMs = endDate - currentDate;
    }
    const diffInSec = Math.round(diffInMs / 1000);
    setRemainingTime(diffInSec);
  }

  const checkUserAccess = async () => {
    try{
      if (remainingTime === 0) {
        const res = await axios.get(`${BACKEND_URL}/calendar/${MODULE}/${user.group}`);
        setEvents(res.data);
        const currentDate = new Date();
        let iterable;

        if(events.length === 0) {
          iterable = res.data;
        } else {
          iterable = events;
        }

        for (const event of iterable) {
          const startDate = new Date(event.start);
          const endDate = new Date(event.end);
          if (currentDate >= startDate && currentDate <= endDate) {
            setIsAllowed(true);
            setStart(new Date(event.start));
            setEnd(new Date(event.end));
            computeTimeRemaining(endDate);
            break;
          } else {
            setIsAllowed(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }

    if(end !== ""){
      computeTimeRemaining();
    }
  };
  
  useEffect(() => {
    checkUserAccess();
    setLoading(false);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(checkUserAccess, 1000);
    return () => clearInterval(intervalRef.current);
  }, [remainingTime]);
  
  const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  if (!isAllowed) {
    return <NotAllowed />;
  }

  return (
    <main>
      <LoadingScreen loading={loading} />
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
      <Container maxWidth={'xl'}>
        <Paper elevation={0} >
          <Grid container spacing={2}>
            <Grid item xs={8} align='center'>
            {/* STM32 livefeed here */}
            
            {/* <img src={STM32Board} alt='STM32' width="300rem" height="350"/> */}
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1" align="center">
                Board Buttons
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}  align='center'>
                  <Button 
                    variant='contained'
                    fullWidth
                    onMouseDown={e => (handleButtonPress(e,"USER",sendSTM32))}
                    onMouseUp={e => (handleButtonRelease(e,"USER",sendSTM32))}
                  >USER
                  </Button>
                </Grid>
                <Grid item xs={6} align='center'>
                  <Button 
                    variant='contained'
                    fullWidth
                    color='inherit'
                    onMouseUp={e => (handleButtonPress(e,"RESET",sendSTM32))}
                  >RESET
                  </Button>
                </Grid>
              </Grid>
              <br />
              <Typography variant="subtitle1" align="center">
                For Accelerometer Simulation
              </Typography>
              <Typography variant="subtitle1">
                Pitch: {pitch}
              </Typography>
              <Slider 
                value={pitch}
                onChange={handlePitchChange}
                valueLabelDisplay="auto"
                min={-90}
                max={90}
                step={5}
              />
              <Typography variant="subtitle1">
                Roll : {roll}
              </Typography>
              <Slider 
                value={roll}
                onChange={handleRollChange}
                valueLabelDisplay="auto"
                min={-90}
                max={90}
                step={5}
              />
              <Typography variant="subtitle1">
                Yaw: {yaw}
              </Typography>
              <Slider 
                value={yaw}
                onChange={handleYawChange}
                valueLabelDisplay="auto"
                min={-180}
                max={180}
                step={5}
              />
              <Typography variant="subtitle1" align="center">
                Erase Program
              </Typography>
              <Grid align='center'>
                <Button 
                  variant='contained' 
                  color='warning'
                  onMouseDown={e => (handleButtonPress(e,"ERASE",sendSTM32))}
                  fullWidth
                >ERASE
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={0}>
          <h3 align='center'>Guide to Remote STM32</h3>
          
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant='subtitle2'>SSH Forwarding</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>We shall use SSH Local Forwarding to establish connection between STM32CubeIDE and OpenOCD as well as RealTerm and ser2net. OpenOCD (gdb server) runs on 3155 and ser2net runs on 3156 on our remote lab worksatation. 
            <br></br>
            To begin forwarding
          </Typography>
          
          <ol>
            <li>Open your terminal (Powershell for Windows)</li>
            <li>Enter this command to establish local forwarding 
              <Box sx={{ bgcolor: "#f0f0f0", p: 1, borderRadius: 1 }}>
                <Typography variant="body2">
                  <code>
                    ssh -L 2000:localhost:3155 user@remotelab
                  </code>
                </Typography>
              </Box>
              <br></br>
              To bundle STM32CubeIDE &harr; OpenOCD and RealTerm &harr; ser2net connection in one command (if you are using UART in the board)
              
              <Box sx={{ bgcolor: "#f0f0f0", p: 1, borderRadius: 1 }}>
                <Typography variant="body2">
                  <code>
                    ssh -L 2000:localhost:3155 -L 2001:localhost:3156 user@remotelab
                  </code>
                </Typography>
              </Box>
              For this command, STM32CubeIDE will connect to localhost:2000 for remote debugging and RealTerm will connect to localhost:2001 for serial interaction
            </li>

            <li>Leave the terminal open and it will close once your session is up</li>
          </ol>

        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant='subtitle2'>STM32 Debug Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Please apply these changes on STM32CubeIDE before starting remote debugging</Typography>
          <ol>
            <li>Build Program</li>
            <li>Right Click to the Project you are working on (e.g., demo_exti_print) &rarr; Debug As &rarr; Debug Configurations...</li>
            <li>Debugger Tab
              <br></br>
              Under GDB Connection Settings, select "Connect to remote GDB server" 
              <br></br>
              Hostname or IP address = localhost. Port Number = 2000
              <br></br>
              Under "Misc" section, uncheck Enable live expresion
            </li>
            <li>
              Click Apply and Debug
            </li>
          </ol>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant='subtitle2'>RealTerm</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>We shall establish RealTerm &harr; ser2net connection</Typography>
          <ol>
            <li>Click"Port" Tab</li>
            <li>Set Baud to 115200 and Port as "localhost:2001"</li>
            <li>Leave Parity, Data Bits, Stop Bits, Hardware Flow Control as it is</li>
            <li>Click Open</li>
          </ol>
        </AccordionDetails>
      </Accordion>
        </Paper>
      </Container>
    </main>
  )
}

export default STM32
