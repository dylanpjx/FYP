import SingleButton from "./SingleButton";
import Button from '@mui/material/Button';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const BoardButtonNames = ["USER","RESET"]
const OrientationButtonNames = ["X-","X+","Y-","Y+","Z-","Z+"]
const BACKEND_URL = 'http://localhost:5000';

const sendSTM32 = async (buttonName, buttonState) => {
  try {
    const response = await axios.post(BACKEND_URL+'/stm32', { button: buttonName, value: buttonState });
    console.log(buttonName, buttonState, response.data)
  } catch (error) {
    console.log(error);
  }
};

const STM32 = () => {
  let navigate = useNavigate();

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
