import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Avatar, TextField, Button } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { FormControlLabel, RadioGroup, Radio} from '@mui/material';

import DialogPopup from './DialogPopup';

const BACKEND_URL = 'http://localhost:5000';

const Login = () => {
    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" };
    const avatarStyle = { backgroundColor: '#1bbd7e' };
    const btnStyle = { margin: '8px 0' };

    let navigate = useNavigate();
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogTitle, setDialogTitle] = useState("");

    const handleDialogClose = () => {
        setDialogTitle("");
        setDialogMessage("");
        setDialogOpen(false);
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userRole, setUserRole] = useState('Student');
;
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    
    // add warning before logging out, and allow users to continue being logged in (in case they are still in editting session)
    useEffect(() => {
        const timer = setTimeout(() => {
            alert("Session timed out")
            setIsAuthenticated(false)
        }, 1000 * 60 * 60) // 1 hr
        return () => clearTimeout(timer)
    },[])

    const onLogin = async (event) => {
        event.preventDefault()

        try {
            const res = await axios.post(`${BACKEND_URL}/login`, {
                username,
                password,
            });
            localStorage.setItem("token", res.data.token);
            setIsAuthenticated(true);

        } catch(err) {
            console.error("Error:", err);
            // setDialogOpen(true);
            // setDialogTitle("Incorrect credentials");
            // setDialogMessage("Incorrect user ID or password. Type the correct user ID and password, and try again.");
        }

        // TEST CODE: TO BE REMOVED
        setIsAuthenticated(true);
        return navigate("/home");
    }

    const onLogout = () => {
        setIsAuthenticated(false)
        localStorage.clear()
    }

    return (
        <div>
            <Grid>
                <Paper elevation={10} style={paperStyle} >
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                        <h2>Sign In</h2>
                    </Grid>

                    <form onSubmit={onLogin}>
                    <Grid 
                        container 
                        direction='column'
                        justify='center'
                        alignItems='stretch'
                        spacing={2}
                    >

                        <Grid item>
                            <TextField 
                                name='username'
                                value={username} 
                                label='Username' 
                                placeholder='Enter username' 
                                variant='outlined' 
                                onChange={(e) => setUsername(e.target.value)} 
                                fullWidth 
                                required 
                            />
                            </Grid>

                            <Grid item>
                                <TextField 
                                    name='password'
                                    value={password} 
                                    label='Password' 
                                    placeholder='Enter password' 
                                    type='password' 
                                    variant='outlined'
                                    onChange={(e) => setPassword(e.target.value)} 
                                    fullWidth 
                                    required 
                                />
                            </Grid>

                            <Grid item>
                                <RadioGroup
                                    name='userGroup'
                                    value={userRole}
                                    onChange={(e)=>{ setUserRole(e.currentTarget.value)}}>    
                                    <FormControlLabel value='Student' control={<Radio />} label='Student' />
                                    <FormControlLabel value='Lecturer' control={<Radio />} label='Lecturer' />
                                    <FormControlLabel value='Admin' control={<Radio />} label='Admin' />
                                </RadioGroup>
                            </Grid>

                            <Grid item>
                                <Button 
                                    type='submit' 
                                    color='primary' 
                                    variant='contained' 
                                    style={btnStyle} 
                                    fullWidth 
                                >
                                    Sign in
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>

            <DialogPopup
            open={dialogOpen}
            title={dialogTitle}
            message={dialogMessage}
            handleClose={handleDialogClose}
            />

            </Grid>
        </div>
    )
}

export default Login;
