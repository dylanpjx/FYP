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
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const Register = () => {
  const theme = createTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [severity, setSeverity] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!/^e\d{7}@u\.nus\.edu$/.test(email)) {
      setEmailError("Email is invalid, use NUS email without alias");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = () => {
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

  const onRegister = async (e) => {
    e.preventDefault();

    if (validateEmail() && validatePassword()) {
      try {
        const res = await axios.post(`${REACT_APP_BACKEND_URL}/user`, {
          email, password
        });
        console.log(res.data);
        setSeverity('success');
        setMessage(res.data);
        setOpen(true);
      } catch (err) {
        console.error(err.response.data);
        setSeverity('error');
        setMessage(err.response.data);
        setOpen(true);
      };
    }
  }

  const handleClose = () => {
    setOpen(false);
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
              <KeyOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={onRegister} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    error={emailError !== ""}
                    helperText={emailError}
                    required
                    fullWidth
                    id="email"
                    label="NUS Email"
                    name="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    error={passwordError !== ""}
                    helperText={passwordError}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment:
                        <InputAdornment position="end">
                        <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>
                    }}
                  />
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

              <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert severity={severity}>
                  {severity === "success" ||
                    message === "User with this email already exists."? (
                      <div>
                      {message}
                      <Link href='/' style={{ padding: 8 }}>
                      Go to login page
                      </Link>
                      </div>
                    ) : (
                      message
                    )}
                </Alert>
              </Snackbar>

              <Grid container>
                <Grid item xs>
                  <Link href="/form" variant="body2">
                    Need help? Contact us
                  </Link>
                </Grid>
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
