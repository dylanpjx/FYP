import React, { createContext, useState, useEffect } from 'react';
import { decodeToken } from 'react-jwt';
import axios from "axios";

import DialogPopup from './DialogPopup';

const BACKEND_URL = 'http://localhost:5000';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogTitle, setDialogTitle] = useState("");

    const handleDialogClose = () => {
        setDialogTitle("");
        setDialogMessage("");
        setDialogOpen(false);
    }

    const [token, setToken] = useState(null);
    const [userAuthenticated, setAuthenticated] = useState(false);

    const storeToken = (tok) => {
        localStorage.setItem('token', tok);
        setToken(tok);
    }
    
    // Refresh upon `token` change
    useEffect(() => {
      if (token) {
        try {
            // decode token and save info in localStorage
            const decoded = decodeToken(token);
            localStorage.setItem('name', decoded.name);
            localStorage.setItem('role', decoded.role);
            localStorage.setItem('group', decoded.group);
            console.log(decoded.modules);
            localStorage.setItem('modules', decoded.modules);
              
            // TODO: add prompt to extend session instead of hard setting the eiry time
            // check for session expiry
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp < currentTime) {
                setAuthenticated(false);
            }
        } catch (err) {
            setAuthenticated(false);
        }
      }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/login`, {
                email,
                password,
            });
            storeToken(res.data.token);
            setAuthenticated(true);
            return true;
        } catch(err) {
            console.error('Error:', err);
            setAuthenticated(false);

            setDialogOpen(true);
            setDialogTitle("Incorrect credentials");
            setDialogMessage("Incorrect user ID or password. Type the correct user ID and password, and try again.");
            return false;
        }
    }

    const logout = () => {
        setAuthenticated(false);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                userAuthenticated
            }}
        >
            {children}

            <DialogPopup 
                open={dialogOpen}
                title={dialogTitle}
                message={dialogMessage}
                handleClose={handleDialogClose}
            />
        </AuthContext.Provider>
    );
}

export default AuthProvider;
