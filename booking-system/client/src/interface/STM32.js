import {
  Button,
  Grid,
  Box,
  Typography,
  Slider,
  Paper,
  Tabs,
  Tab,
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
import { getAcclerometerValues } from '../GetAccValues';
import { 
  sampleGPIOInit,
  sampleGPIOCallback,
  sampleUARTInit,
  sampleUARTCode,
  sampleUARTCodeSensor,
  sampleI2CInit,
  sampleI2CPinsInit,
  sampleI2CCode
} from '../SampleSTM32Codes'; 

import LoadingScreen from './LoadingScreen';
import NotAllowed from './NotAllowed';

const BACKEND_URL = 'http://localhost:5000';
const MODULE = 'EE2028';

const sendSTM32 = async (buttonName, buttonState) => {
  try {
    const response = await axios.post(
      BACKEND_URL+'/stm32', 
      { button: buttonName, value: buttonState }
    );
    console.log(buttonName, buttonState, response.data)
  } catch (error) {
    console.log(error);
  }
};

const CodeBlock = ({ code }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Box
      sx={{
        bgcolor: "#f0f0f0",
        p: 1,
        borderRadius: 1,
        position: "relative",
      }}
    >
      <Typography
        variant="body2"
        component="code"
        sx={{
          whiteSpace: "pre-wrap",
          fontFamily: "Menlo, monospace",
        }}
      >
        {code}
      </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            fontSize: "0.8rem",
            padding: "2px",
            transition: "opacity 0.2s",
            "&:hover": {
              opacity: 1,
              bgcolor: "white",
            },
          }}
          onClick={handleCopy}
        >
          Copy
        </Button>
    </Box>
  );
};


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
  const [tabValue, setTabValue] = useState(0);

  let intervalRef = useRef();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
      <Container maxWidth={'xl'}>
        <Paper elevation={0} >
          <p>Remaining time: {formatTime(remainingTime)}</p>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={8} align='center'>
            <Typography variant="subtitle1" align="center">
                STM32 Livefeed
            </Typography>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/3vDz4_xp6oM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </Grid>
            <Grid item xs={4} >
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
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Guide to Remote STM32" />
          <Tab label="Virtual Buttons" />
          <Tab label="Example Code" />
        </Tabs>

        <div hidden={tabValue !== 0}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant='subtitle2'>SSH Local Forwarding</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>We shall use SSH Local Forwarding to establish connection between STM32CubeIDE and OpenOCD as well as RealTerm and ser2net. OpenOCD (gdb server) runs on 3155 and ser2net runs on 3156 in our Remote Lab Workstation. 
              <br></br>
              To begin forwarding
            </Typography>
            
            <ol>
              <li>Open your terminal (Powershell for Windows)</li>
              <li>Enter this command to establish local forwarding 
                <CodeBlock code='ssh -L 2000:localhost:3155 student@fpgaws2.panicker.in'></CodeBlock>
                <br></br>
                To bundle STM32CubeIDE &harr; OpenOCD and RealTerm &harr; ser2net connection in one command (if you are using UART in the board)
                <CodeBlock code='ssh -L 2000:localhost:3155 -L 2001:localhost:3156 student@fpgaws2.panicker.in'></CodeBlock>
                In your computer, STM32CubeIDE will connect to localhost:2000 for remote debugging and RealTerm will connect to localhost:2001 for serial interaction
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
              <li>Right Click your project and Build Program</li>
              <li>Right Click your Project &rarr; Debug As &rarr; Debug Configurations...</li>
              <li>Debugger Tab
                <br></br>
                Under GDB Connection Settings, select "Connect to remote GDB server" 
                <br></br>
                Hostname or IP address = localhost. Port Number = 2000
                <br></br>
                Under "Misc" section, uncheck "Enable live expresion"
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
              <li>Set Baud to 115200 and Port as "localhost:2001" since we intialized 2001 for local forwarding to ser2net</li>
              <li>Leave Parity, Data Bits, Stop Bits, Hardware Flow Control as it is</li>
              <li>Click Open</li>
            </ol>
          </AccordionDetails>
        </Accordion>
        </div>

        <div hidden={tabValue !== 1}>
          <ol>
            <li>Press and Release the "USER" button to virtualize a button press on the board. </li>
            <li>Press the "RESET" button to trigger a reset.</li>
            <li>Press the "ERASE" button to erase the program flashed on the board.</li>
            <li>The three sliders are for adjusting the angles (pitch, roll, yaw) to simulate a rotation of an accelerometer sensor. These simulated readings can be obtained using an I2C Slave Board (example code on Example Code Tab &rarr; I2C)</li>
          </ol>
        </div>
        <div hidden={tabValue !== 2}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant='subtitle2'>GPIO</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>GPIO Pins Initialization for LED and Virtual Button (PC5) </Typography>
            <CodeBlock code={sampleGPIOInit}/>
            <br></br>
            <Typography>GPIO Callback</Typography>
            <CodeBlock code={sampleGPIOCallback}/>
          </AccordionDetails>
            
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant='subtitle2'>UART</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>UART Initialization</Typography>
            <CodeBlock code={sampleUARTInit}></CodeBlock>
            <br></br>
            <Typography>UART Transmit</Typography>
            <CodeBlock code={sampleUARTCode}></CodeBlock>
            <br></br>
            <Typography>UART Transmit Accelerometer Sensor (LSM6DSL) Data</Typography>
            <CodeBlock code={sampleUARTCodeSensor}></CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant='subtitle2'>I2C</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <h3>We will configure the physical pins (PB8 and PB9) as I2C and receive data from an I2C Slave Board (0x20). Please copy with caution.</h3>
            <br></br>
            <Typography>I2C Pins (PB8 and PB9) Initialization (Place these codes in Core/Src/stm32l4xx_hal_msp.c)</Typography>
            <CodeBlock code={sampleI2CPinsInit}></CodeBlock>
            <br></br>
            <Typography>I2C Handler Initialization (Place these codes in Core/Src/main.c)</Typography>
            <CodeBlock code={sampleI2CInit}></CodeBlock>
            <br></br>
            <Typography>I2C Read From Simulated Sensor with Slave Address of 0x20</Typography>
            <CodeBlock code={sampleI2CCode}></CodeBlock>
          </AccordionDetails>
        </Accordion>
        </div>
        </Paper>
      </Container>
    </main>
  )
}

export default STM32
