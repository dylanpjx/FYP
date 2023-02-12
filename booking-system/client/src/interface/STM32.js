import SingleButton from "./SingleButton";
import Button from '@mui/material/Button';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useNavigate } from "react-router-dom";

const ButtonNames = ["USER","RESET","TiltForward","TiltBackward","TiltLeft","TiltRight"]

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
      <div className="STM32ButtonsContainer">
        {ButtonNames.map((ButtonName) => <SingleButton name={ButtonName} key={ButtonName}/>)}
      </div>
    </main>
  )
}

export default STM32
