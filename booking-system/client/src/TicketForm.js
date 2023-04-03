import React, { useState } from 'react';
import axios from 'axios';
import { 
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";


const TicketForm = () => {
    let navigate = useNavigate();
    const theme = createTheme();

    // Form input fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [ticketType, setTicketType] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");


    const onSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/ticket`, {
                name, email, description, ticketType
            });
            console.log(res.data);
            setDialogOpen(true);
            setDialogMessage("Ticket Filed Successfully.");
            
            
        } catch (err) {
            console.error(err.response.data);
            setDialogOpen(true);
            setDialogMessage(err.response.data);
        }

    }

    const handleDialogClose = () => {
      setDialogMessage("");
      setDialogOpen(false);
      return navigate("/");
    }


    return (
        <div>
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                onClick={() => navigate("/home")}
                startIcon={ <ArrowLeftIcon /> }
              >
                Back
              </Button>
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
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="ticket-type-label">Ticket Type</InputLabel>
                      <Select
                        labelId="ticket-type-label"
                        id="ticket-type"
                        value={ticketType}
                        label="Ticket Type"
                        onChange={(e) => setTicketType(e.target.value)}
                      >
                        <MenuItem value={'Bug'}>Bug</MenuItem>
                        <MenuItem value={'Question'}>Question</MenuItem>
                      </Select>
                    </FormControl>
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
            <Dialog
              open={dialogOpen}
              onClose={handleDialogClose}
            >
              <DialogTitle>Success</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {dialogMessage}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>
                  Close
                </Button>
              </DialogActions>
            </Dialog>      
        </div>
    )
};
export default TicketForm;
