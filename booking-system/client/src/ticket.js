import React, { useState } from 'react';
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

const TicketForm = () => {
    let navigate = useNavigate();
    const theme = createTheme();

    // Form input fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        
        // Send ticket data to backend API
        const ticketData = { name, email, description };
        // Assuming the API returns a success boolean
        const success = await sendTicketDataToBackend(ticketData);

        if (success) {
            // Navigate to the success page if submission was successful
            return navigate('/ticket/success');
        } else {
            // Display error message to user if submission failed
            alert('An error occurred. Please try again later.');
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
}

export default TicketForm;
