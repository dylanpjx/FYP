import React from 'react';
import { Link } from "react-router-dom";
import { Paper, Button } from '@mui/material';

const Homepage = (props) => {
    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" };
    const btnStyle = { margin: '8px 0' };
    
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    const modules = localStorage.getItem('modules');

    // TODO:
    // 1. render button to navigate to the various devices depending on module
    // 2. add instrucitonal text
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
