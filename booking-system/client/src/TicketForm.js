import React, { useState } from 'react';
import axios from 'axios';
import { 
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

const BACKEND_URL = 'http://localhost:5000';

const TicketForm = () => {
    let navigate = useNavigate();
    const theme = createTheme();

    // Form input fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post(`${BACKEND_URL}/ticket`, {
                name, email, description
            });
            console.log(res.data);
            return navigate('/ticketsucess');
            
        } catch (err) {
            console.error(err.response.data);
        }
    }
    return (
        <div>
            <ThemeProvider theme={theme}>
              <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography component="h1" variant="h5">
                    File Ticket
                  </Typography>
                  <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      name="name"
                      autoComplete="name"
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="email"
                      label="Email"
                      type="email"
                      id="email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="description"
                      label="Description"
                      type="text"
                      id="description"
                      multiline
                      rows={10}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Submit Ticket
                    </Button>
                  </Box>
                </Box>
              </Container>
            </ThemeProvider>
        </div>
    )
};
export default TicketForm;
