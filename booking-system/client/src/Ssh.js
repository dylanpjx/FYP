import React, { useEffect, useContext } from 'react';
import {
    Grid,
    TextField
} from '@mui/material';
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from './AuthProvider';

const Ssh = () => {
    const theme = createTheme();
    
    const { user } = useContext(AuthContext);
    
    const {key, setKey} = useEffect("");

    const onSubmit = async () => {
    }
    
    const display_key_status = async (user) => {
        sshkey = user.sshkey;
    }
    
    return (
        <div>
            <Grid>
                <TextField />
            </Grid>
        </div>
    );
}
