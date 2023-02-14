import React, { useState } from 'react';
import axios from 'axios';
import { 
    Alert,
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    Link,
    TextField,
    Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const BACKEND_URL = 'http://localhost:5000';

const Register = () => {
    const theme = createTheme();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const validateEmail = () => {
        console.log("email");
        if (!email) {
            setEmailError("Email is required");
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Email is invalid");
            return false;
        } else {
            setEmailError("");
            return true;
        }
    };

    const validatePassword = () => {
        console.log("pass");
        if (!password) {
            setPasswordError("Password is required");
            return false;
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return false;
        } else {
            setPasswordError("");
            return true;
        }
    }; 

    const validateConfirmPassword = () => {
        console.log("confirm");
        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your password");
            return false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return false;
        } else {
            setConfirmPasswordError("");
            return true;
        }
    };

    const onRegister = async (e) => {
        e.preventDefault();
        
        if (validateEmail() && validatePassword() && validateConfirmPassword()) {
            try {
                const res = await axios.post(`${BACKEND_URL}/register`, {
                    email, password
                });
                setMessage(res.data.message);
            } catch (err) {
                setMessage(err.response.data.message);
            };
        }
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
                    Sign up
                  </Typography>
                  <Box component="form" noValidate onSubmit={onRegister} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      {
                          emailError && 
                          <Alert severity="error" variant="outlined">
                              {emailError}
                          </Alert>
                      }
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="new-password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      {
                          passwordError && 
                          <Alert severity="error" variant="outlined">
                              {passwordError}
                          </Alert>
                      }
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          name="repassword"
                          label="Re-enter Password"
                          type="password"
                          id="repassword"
                          autoComplete="new-password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      {
                          confirmPasswordError && 
                          <Alert severity="error" variant="outlined">
                              {confirmPasswordError}
                          </Alert>
                      }
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                      <Grid item>
                        <Link href="/" variant="body2">
                          Already have an account? Sign in
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

export default Register;
