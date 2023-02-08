import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import DialogPopup from './DialogPopup';

const BACKEND_URL = 'http://localhost:5000';

const AuthProvider = () => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogTitle, setDialogTitle] = useState("");

    const handleDialogClose = () => {
        setDialogTitle("");
        setDialogMessage("");
        setDialogOpen(false);
    }

    let navigate = useNavigate();

    // From DB
    const [token, setToken] = useState(null);
    const [name, setName] = useState(null);
    const [group, setGroup] = useState(null);
    const [isTokenExpired, setIsTokenExpired] = useState(false);

    const storeToken = (tok) => {
        localStorage.setItem('token', tok);
        setToken(tok);
    }

    useEffect(() => {
      if (token) {
        try {
          const decoded = jwt.verify(token, 'secretkey');
          localStorage.setItem("name", decoded.name);
          localStorage.setItem("group", decoded.group);
          localStorage.setItem("modules", decoded.modules);
            
          // check for session expiry
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp < currentTime) {
            setIsTokenExpired(true);
          }
        } catch (err) {
          setIsTokenExpired(true);
        }
      }
    }, [token]);

    const login = async (username, password) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/login`, {
                username,
                password,
            });
            storeToken(res.data.token);
            return navigate('/home');
        } catch(err) {
            console.error('Error:', err);
            // setDialogOpen(true);
            // setDialogTitle("Incorrect credentials");
            // setDialogMessage("Incorrect user ID or password. Type the correct user ID and password, and try again.");
        }
    }

    const logout = () => {
        localStorage.clear();
    };
}
