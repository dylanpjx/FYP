import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router-dom";

const FPGA = () => {

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
          <h2>Before your booking:</h2><br/>
          You can prep your design for remote debugging by adding a Virtual IO IP core to it. This allows you to use a virtual panel in Vivado to simulate hardware inputs like push buttons and switches. <b>IF YOU ARE ONLY USING UART, YOU CAN SKIP THE INSTRUCTIONS BELOW.</b><br/><br/>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}
            >
              The following instructions describes how you could add VIO core manually to your design.
            </AccordionSummary>

            <AccordionDetails>
              <ol>
                <li>Add VIO core to your project:</li>
                  <ul>
                    <br/>
                    <li>Click on <b>IP Catalog</b> in <b>Project Manager</b> tab in Vivado</li>
                    <br/>
                    <img src={require('./images/fpga/ip_catalog.png')} height={400}/>
                    <br/>
                    <br/>

                    <li>Search for "VIO" in the IP catalog</li>
                    <br/>
                    <img src={require('./images/fpga/vio_in_catalog.png')} height={400}/>
                    <br/>
                    <br/>

                    <li>Configure the VIO core accordingly.</li>
                    <br/>
                    <b>Input Probe Count</b> = Number of outputs to your design that you want to virtualize<br/>
                    <b>Output Probe Count</b> = Number of inputs to your design that you want to virtualize<br/>
                    Change the Probe Widths per port accordingly in <b>PROBE_IN Ports</b> and <b>PROBE_OUT Ports</b>
                    <br/>
                    <br/>
                    eg. Design uses 16 LED, AN, CAT and 16 Switches: <br/>
                    <b>Input Probe Count</b> = 3<br/>
                    <b>Output Probe Count</b> = 1<br/><br/>

                    <b>PROBE_IN0</b> = 16 (16 LEDs)<br/>
                    <b>PROBE_IN1</b> = 4 (4 Anode)<br/>
                    <b>PROBE_IN2</b> = 7 (Cathode)<br/><br/>

                    <b>PROBE_OUT0</b> = 16 (16 SW)<br/><br/>

                    <img src={require('./images/fpga/vio_port_config.png')} height={400}/>
                    <br/>
                    <br/>
                  </ul>

                <li>Click on <b>Ok > Generate</b></li>
                <br/>
                <li>Wire VIO Core to your project</li>
                  <ul>
                    <li>Example wrapper file to wire the IP core to your top file</li>
                    <br/>
                    <img src={require('./images/fpga/vio_wrapper.png')} height={400}/>
                    <br/>
                    <li>Alternatively, you could package your design as an IP as seen <a href="https://wiki.nus.edu.sg/display/ee4218/Packaging+the+Coprocessor+as+an+IP">here</a></li>
                  </ul>
                <br/>
                <li>The VIO IP is successfully integrated to your design, generate bitstream</li>
              </ol>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}
            >
              Alternatively, you could use our script to automatically add the VIO core to your design.
            </AccordionSummary>

            <AccordionDetails>
              <b>Please do not download and run the script blindly, read below and understand what the script does.</b>
              <ol>
                <li>Add Vivado to path and run <code>settings64.sh</code>/<code>settings64.bat</code> in <code>Vivado/[VERSION]</code> directory</li>
                <li>Download the folder <a href="/package_vio.zip">here</a>.</li>
                <li>Extract the contents of the zip folder into your project root like this:</li><br/>
                <img src={require('./images/fpga/zip_contents.png')} height={400}/>
                <br/>
                <br/>
                <li>Open terminal in your project root and run <code>vivado -mode batch -source init.tcl</code></li>
                <li>The script will:</li>
                  <ul>
                    <li>Add the VIO core to your project</li>
                    <li>Add a Wrapper file that connects to Top.v and the VIO core</li>
                    <li>Disables the current constraint file and adds a new constraint file compatible with the VIO core</li>
                  </ul>
                <li>Once the script is complete, you can generate bitstream and continue with the instructions below</li>
              </ol>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </div>
  );
};

export default FPGA;
