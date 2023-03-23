import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Grid
} from '@mui/material'

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
          <h2>Guide to Remote FPGA</h2>
          <br/>
          <ol>
            <li>Open a terminal and run <code>SSH -L -N 1234:localhost:3121 fpgaws2.panicker.in</code> for Vivado</li>
            <li>Open a terminal and run <code>SSH -L -N 1235:localhost:3131 fpgaws2.panicker.in</code> for Console</li>

            <li>On Vivado, <b>Generate bitstream > Open Hardware Manager > Open Target > Open new Target... > Next</b></li>
            <li>Configure the target as shown in the image below:</li>
            <br/>
            <img src={require('../images/fpga/vivado_hw_target.png')} height={400}/>
            <br/>
            <br/>
            <li>If you or your group members have booked the system, you would be able to access the FPGA and can perform your normal workflow.</li>
            <br/>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon/>}
                >
                  If you are using UART:
                </AccordionSummary>

                <AccordionDetails>
                    RealTerm is a terminal program specially designed for capturing and sending data through various protocols (UART, Raw TCP sockets etc). The purpose is similar to that of TeraTerm or PuTTY or GTKTerm or Serial Monitor (Arduino), but RealTerm is WAY more feature-rich than any other serial console program.<br/><br/>
                  <ul>
                    <li>Change <b>Port</b> to <b>127.0.0.1:1235</b>, and select <b>Raw</b> for <b>Winsock</b>, change the <b>Baud</b> rate to <b>115200</b></li>
                    <br/>
                    <img src={require('../images/fpga/realterm_success.png')} height={400}/>
                    <br/>
                    <br/>
                  
                    <li>Click on <b>Open</b> to open the port. The status on the right should be green or gray, not red.</li>

                    <li><b>Few notes on the usage of RealTerm</b></li>
                    <ul>
                      <li>Sending bytes using RealTerm: Click on the <b>Send</b> tab, type a number and click <b>Send Numbers/Send ASCII</b>. If you input, say 20 there and press <b>Send Numbers</b>, it will send 0x14. You can also enter directly as hexadecimal 0x14 and press <b>Send Numbers</b>.</li>

                      <li>You can also use escape sequences (special characters) such as \r, \n etc.</li>

                      <li>Sending text file contents using RealTerm: Specify the file in the <b>Dump File to Port</b> and click <b>Send File</b>.</li>

                      <li>Capturing data into a file using RealTerm: Click on <b>Capture</b> tab and specify the file where you want the output to be saved. Click on <b>Start Overwrite</b>.  Check the <b>Display</b> option (available only in the newer versions) if you wish to see the data that is getting captured.</li>
                    </ul>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon/>}
                >
                  If you are using VIO:
                </AccordionSummary>

                <AccordionDetails>
                  <ul>
                    <li>You will be greeted with a VIO panel as shown below</li>
                    <br/>
                    <img src={require('../images/fpga/vio_panel.png')} height={400}/>
                    <br/>
                    <br/>
                    <li>You can then add the inputs and outputs you want to observe via the <b>+</b> icon on the top</li>
                    <br/>
                    <img src={require('../images/fpga/vio_panel_buttons.png')} height={400}/>
                    <br/>
                    <br/>
                    <li>You can click on the buttons or change the values of switches using the panel and observe the outputs</li>
                  </ul>
                </AccordionDetails>
              </Accordion>
              <br/>
              <li>Remember to save your work <b>BEFORE</b> your booking ends</li>
            </ol>
          </Grid>
      </Grid>
    </div>
  )
}

export default FpgaVid;
