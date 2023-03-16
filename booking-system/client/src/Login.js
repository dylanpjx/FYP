import React, { useContext, useState } from 'react';
import { 
    Avatar,
    Box,
    Button,
    Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

import { AuthContext } from './AuthProvider';

const Login = () => {
    let navigate = useNavigate();
    const theme = createTheme();
    
    const { login } = useContext(AuthContext);

    // Submitted fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const onLogin = async (e) => {
        e.preventDefault();

        const success = await login(email, password);
        if (success)
            return navigate('/home');
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
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
                  <Box component="form" onSubmit={onLogin} noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign In
                    </Button>

                    <Grid container justifyContent="flex-end">
                    {/*
                      <Grid item xs>
                        <Link href="#" variant="body2">
                          Forgot password?
                        </Link>
                      </Grid>
                    */}
                      <Grid item>
                        <Link href="/register" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                        <br><Link href="/ticketform" variant="body2">
                            {"Need help? Contact us"}
                        </Link>
                      </Grid>
                    </Grid>

                  </Box>
                </Box>
              </Container>
            </ThemeProvider>
        </div>
    )
}

export default Login;
