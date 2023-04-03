import React, { createContext, useState, useEffect } from 'react';
import { decodeToken } from 'react-jwt';
import axios from "axios";

import DialogPopup from './DialogPopup';


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

  const userFromToken = (token) => {
    try {
      const decoded = decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        return null;
      }
      return { ...decoded };
    } catch(err) {
      return null;
    }
  }
  const [user, setUser] = useState(() => {
    // Check if localStorage has valid token
    const maybeToken = localStorage.getItem('token');
    if (!maybeToken) {
      return null;
    }
    return userFromToken(maybeToken);
  });
  const [userAuthenticated, setAuthenticated] = useState(() => {
    return (user !== null);
  });

  const storeToken = (tok) => {
    localStorage.setItem('token', tok);
    setUser(userFromToken(tok));
  }

  // Refresh upon `user` change
  useEffect(() => {
    if (user === null) {
      setAuthenticated(false);
    } else {
      setAuthenticated(true);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
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
        user,
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
