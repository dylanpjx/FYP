import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useNavigate } from "react-router-dom";

import { AuthContext } from './AuthProvider';
import './Ssh.css';


const Ssh = () => {
  let navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [sshKey, setHasSshKey] = useState(false);

  const [form, setForm] = useState("");
  const [OS, setOS] = useState('Win');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alert, setAlert] = useState(false);


  useEffect(() => {
    if (user.sshkey) {
      setHasSshKey(true);
    } else {
      setHasSshKey(false);
    }
  }, [user.sshkey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user.id);

    try {
      const res = await axios.put(`${REACT_APP_BACKEND_URL}/ssh/${user.id}`, {
        sshkey: form
      });

      setForm("");
      setAlert(true);
      setAlertMessage(res.data);
      setAlertSuccess(true);
    } catch (err) {
      console.error(err.response.data);
      setAlert(true);
      setAlertMessage(err.response.data);
      setAlertSuccess(false);
    }
  }

  const display_instructions = (OS) => {
    switch (OS) {
      case 'Win':
        return (
          <ol>
            <li>Open powershell</li>
            <li>Enter <code>dir C:\Users\<em>your_username</em>\.ssh\id_rsa</code> to see if existing ssh keys are present</li>
            <li>Check the directory listing to see if you already have a public SSH key. The filenames of public keys should be one of the following:</li>
              <ul>
                <li><em>id_rsa.pub</em></li>
                <li><em>id_ecdsa.pub</em></li>
                <li><em>id_ed25519.pub</em></li>
              </ul>
            <li>Either generate a new SSH key or upload an existing key.</li>
          </ol>
        );
      case 'Mac':
      case 'Linux':
        return (
          <ol>
            <li>Open terminal</li>
            <li>Enter <code>ls -al ~/.ssh</code> to see if existing ssh keys are present</li>
            <li>Check the directory listing to see if you already have a public SSH key. The filenames of public keys should be one of the following:</li>
            <ul>
              <li><em>id_rsa.pub</em></li>
              <li><em>id_ecdsa.pub</em></li>
              <li><em>id_ed25519.pub</em></li>
            </ul>
            <li>Either generate a new SSH key or upload an existing key.</li>
          </ol>
        );
    }
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

        <Grid container
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <Grid item xs={8}
            sx={{minWidth: "800px", marginBottom: "20px"}}
          >
            <Box component="form" onSubmit={handleSubmit}>
              <h1>Key</h1>
              <TextField
                id="ssh-key"
                variant="outlined"
                fullWidth
                multiline
                minRows={4}
                onChange={(e) => setForm(e.target.value)}
                placeholder="Begins with 'ssh-rsa', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', 'ssh-ed25519', 'sk-ecdsa-sha2-nistp256@openssh.com', or 'sk-ssh-ed25519@openssh.com'"
                sx={{ marginBottom: "5px" }}
              />
              <Button type="submit" variant="contained" color="primary">
                Update SSH key
              </Button>
            </Box>

            {alert ? <Alert 
              onClose={() => {setAlert(false);}}
              severity={alertSuccess ? "success" : "error"}>{alertMessage}</Alert> : <></> }
          </Grid>

          <Grid item xs={8} 
            sx={{ minWidth: "800px" }}
          >
            <h1>Instructions</h1>
            <h3>How to get SSH key?</h3>
            <ToggleButtonGroup
              color="primary"
              value={OS}
              exclusive
              onChange={(e) => setOS(e.target.value)}
              sx={{ padding: "10px" }}
            >
              <ToggleButton value="Win">Win</ToggleButton>
              <ToggleButton value="Mac">Mac</ToggleButton>
              <ToggleButton value="Linux">Linux</ToggleButton>
            </ToggleButtonGroup>
            {display_instructions(OS)}
          </Grid>

          <Grid item xs={8}
            sx={{ minWidth: "800px" }}
          >
            <h3>Generating a new SSH key</h3>
            <ol>
              <li>Open terminal</li>
              <li>Paste the text below, substituting in your email address <br/></li>
                <Paper
                  variant="outlined"
                  sx={{ margin: "4px 0", padding: "10px", display: 'inline-block' }}
                >
                  <code>$ ssh-keygen -t ed25519 -C "your_email@example.com"</code>
                </Paper>

                <br/><br/>This creates a new SSH key, using the provided email as a label.<br/>

                <Paper
                  variant="outlined"
                  sx={{ margin: "4px 0", padding: "10px", display: 'inline-block' }}
                >
                  <code>> Generating public/private ALGORITHM key pair.</code><br/>
                </Paper>

                <br/>When you're prompted to "Enter a file in which to save the key", you can press Enter to accept the default file location. Please note that if you created SSH keys previously, ssh-keygen may ask you to rewrite another key, in which case we recommend creating a custom-named SSH key. To do so, type the default file location and replace id_ssh_keyname with your custom key name. <br/>

                <Paper
                  variant="outlined"
                  sx={{ margin: "4px 0", padding: "10px", display: 'inline-block' }}
                >
                  <code>> Enter a file in which to save the key (/Users/YOU/.ssh/id_ALGORITHM: [Press enter]</code>
                </Paper>

                <li>At the prompt, type a secure passphrase.<br/></li>
                <Paper
                variant="outlined"
                sx={{ margin: "4px 0", padding: "10px", display: 'inline-block' }}
                >
                  <code>> Enter passphrase (empty for no passphrase): [Type a passphrase]</code><br />
                  <code>> Enter same passphrase again: [Type passphrase again]</code>
                </Paper>
              </ol>
          </Grid>
        </Grid>
      </div>
    );
}

export default Ssh;
