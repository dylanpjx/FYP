import React from 'react';
import { 
    Box,
    Container,
    CssBaseline,
    Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const TicketSuccess = () => {
    const theme = createTheme();
    
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
                    Ticket Filed Successfully!
                  </Typography>
                  
                </Box>
              </Container>
            </ThemeProvider>
        </div>
    )
};

export default TicketSuccess;