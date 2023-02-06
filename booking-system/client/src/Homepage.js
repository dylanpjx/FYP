import React from 'react';
import { Link } from "react-router-dom";
import { Paper, TextField, Button } from '@mui/material';

import Calendar from './Calendar';

const Homepage = (props) => {
    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" };
    const btnStyle = { margin: '8px 0' };

    return (
        <Paper elevation={10} style={paperStyle} >
            <h2>Homepage</h2>
            <h3> {localStorage.getItem('username')} ({localStorage.getItem('userRole')}) </h3>
            <Link to="/calendar">
                <Button
                    color='primary'
                    variant='contained'
                    style={btnStyle}
                >
                    Book a timeslot
                </Button>
            </Link>
            <Button
                type='submit'
                color='secondary'
                variant='contained'
                style={btnStyle}
                onClick={props.onLogout}
                fullWidth
            >
                Sign out
            </Button>
        </Paper>
    );
}

export default Homepage;
