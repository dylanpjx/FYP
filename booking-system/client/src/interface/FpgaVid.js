import {
  Button,
  Grid
} from '@mui/material'

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useNavigate } from "react-router-dom";

const FpgaVid = () => {
  let navigate = useNavigate();

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => navigate("/home")}
        startIcon={ <ArrowLeftIcon /> }
      >
        Back
      </Button>

      <Grid container
        spacing={3}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "50px",
        }}
      >

        <Grid item xs={8}
          sx={{
            minWidth: "800px"
          }}
        >
          <h2>After your booking:</h2><br/>
          Disconnect from remote FPGA by closing the hardware server on Vivado.<br/><br/>
          Disconnect from the remote UART by clicking the <b>Open</b> button such that it is "unpressed".

          
        </Grid>
      </Grid>
    </div>
  )
}

export default FpgaVid;
