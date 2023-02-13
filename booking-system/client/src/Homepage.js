import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { Paper, Button, ButtonGroup } from '@mui/material';
import { useNavigate } from "react-router-dom";

import { AuthContext } from './AuthProvider';

const Homepage = (props) => {
    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" };
    const buttonGroupStyle = { display: "block", padding: 10 };
    const buttonStyle = { };

    let navigate = useNavigate();
    
    const { logout } = useContext(AuthContext);

    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    const modules = JSON.parse(localStorage.getItem('modules'));

    const onLogout = () => {
        logout();
        return navigate('/');
    }

    const gen_module_links = (modules) => {
        return modules.map((module) => {
            switch (module) {
                case "EE4218":
                    return (
                        <Link to="/zedboard">
                            <Button
                                color='primary'
                                variant='contained'
                                fullWidth
                                style={ buttonStyle }
                            >
                                EE4218
                            </Button>
                        </Link>
                    );
                case "EE2026":
                    return (
                        <Link to="/artix">
                            <Button
                                color='primary'
                                variant='contained'
                                fullWidth
                                style={ buttonStyle }
                            >
                                EE2026
                            </Button>
                        </Link>
                    )
                case "EE2028":
                    return (
                        <Link to="/stm32">
                            <Button
                                color='primary'
                                variant='contained'
                                fullWidth
                                style={ buttonStyle }
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

    // TODO: add instructional text
    return (
        <Paper elevation={10} style={paperStyle} >
            <h2>Homepage</h2>
            <h3> {name} ({role}) </h3>

            <ButtonGroup 
                orientation="vertical"
                variant="contained"
                style= {buttonGroupStyle}
            >
                <Link to="/calendar">
                    <Button
                        color='primary'
                        variant='contained'
                        fullWidth
                        style={ buttonStyle }
                    >
                        Book a timeslot
                    </Button>
                </Link>
                {gen_module_links(modules)}

            </ButtonGroup>

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
    );
}

export default Homepage;
