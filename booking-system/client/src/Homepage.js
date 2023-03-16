import React, { useContext } from 'react';
import { 
    Box,
    Button,
    ButtonGroup,
    Container,
    CssBaseline,
    Grid,
    Paper,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link } from "react-router-dom";

import { AuthContext } from './AuthProvider';

const Homepage = (props) => {
    const paperStyle = { display: "flex", flexDirection: "column", padding: 20, margin: "20px auto" };
    const buttonGroupStyle = { display: "block", marginBottom: 80 };

    let navigate = useNavigate();
    const theme = createTheme();
    
    const { user, logout } = useContext(AuthContext);

    const onLogout = () => {
        logout();
        return navigate('/');
    }

    const gen_module_links = (modules) => {
        return modules.map((module) => {
            switch (module) {
                case "EE4218":
                    return (
                        <Link to="/zedboard" key="zedboard">
                            <Button
                                color='primary'
                                variant='contained'
                                fullWidth
                            >
                                EE4218
                            </Button>
                        </Link>
                    );
                case "EE2026":
                    return (
                        <Link to="/artix" key="artix">
                            <Button
                                color='primary'
                                variant='contained'
                                fullWidth
                            >
                                EE2026
                            </Button>
                        </Link>
                    )
                case "EE2028":
                    return (
                        <Link to="/stm32" key="stm32">
                            <Button
                                color='primary'
                                variant='contained'
                                fullWidth
                            >
                                EE2028
                            </Button>
                        </Link>
                    )
                default:
                    return null;
            };
        });
    }

    return (
        <div>
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
                <h1>Homepage</h1>

                <Paper elevation={3} style={paperStyle} >

                    <Grid container columnSpacing={1} direction="row" alignItems="center"> 
                        <Grid item>
                            <PersonIcon />
                        </Grid>
                        <Grid item marginBottom="6px">
                            <h3>{user.name} ({user.role})</h3>
                        </Grid>
                    </Grid>

                    <Grid container rowSpacing={3} direction="column" alignItems="center"> 
                        <Grid item>
                            <p>Book a timeslot using the calendar:</p>
                            <Link to="/calendar">
                                <Button
                                    color='primary'
                                    variant='contained'
                                    fullWidth
                                >
                                    Calendar
                                </Button>
                            </Link>
                        </Grid>

                        <Grid item>
                            <p>Add your SSH public key here. This is used for authentication purposes for the app. Please do so before accessing the other sites below</p>
                            <Link to="/ssh">
                                <Button
                                    color='primary'
                                    variant='contained'
                                    fullWidth
                                >
                                    Add SSH key
                                </Button>
                            </Link>
                        </Grid>

                        <Grid item>
                            <p>Access the relevant FPGA/MCU based on the module you are enrolled in:</p>
                            <ButtonGroup 
                                orientation="vertical"
                                variant="contained"
                                style= {buttonGroupStyle}
                            >
                                {gen_module_links(JSON.parse(user.modules))}
                            </ButtonGroup>

                        </Grid>

                        <Grid item>
                            <Link href="/ticketform" variant="body2">
                                Need help? Contact us
                            </Link>
                        </Grid>
                    </Grid>



                    <Button
                        type='submit'
                        color='secondary'
                        variant='contained'
                        onClick={onLogout}
                        fullWidth
                    >
                        Sign out
                    </Button>
                </Paper>
            </Box>
        </Container>
        </ThemeProvider>
        </div>
    );
}

export default Homepage;
