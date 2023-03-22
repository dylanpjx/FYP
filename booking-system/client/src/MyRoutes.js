import React, { useContext } from 'react';
import { Navigate, Routes, Route, BrowserRouter as Router, useLocation } from "react-router-dom";

import { AuthContext } from './AuthProvider';
import Login from './Login';
import Register from './Register';
import Homepage from './Homepage';
import Ssh from './Ssh';
import Calendar from './Calendar';
import NotFound from './NotFound';

import FPGA from './FPGA';
import FpgaVid from './interface/FpgaVid'
import Stm32 from './interface/STM32';
import './interface/Interface.css';

const RequireAuth = ({ children }) => {
  const { userAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!userAuthenticated) {
    return <Navigate to="/" state={{ from:location }} replace />;
  }

  return children;
}

const MyRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="home" element={
          <RequireAuth>
            <Homepage />
          </RequireAuth>
        } />
        <Route path="ssh" element={
          <RequireAuth>
            <Ssh />
          </RequireAuth>
        } />
        <Route path="calendar" element={
          <RequireAuth>
            <Calendar />
          </RequireAuth>
        } />
        <Route path="fpga" element={
          <RequireAuth>
            <FPGA />
          </RequireAuth>
        } />
        <Route path="fpgavid" element={
          <RequireAuth>
            <FpgaVid />
          </RequireAuth>
        } />
        <Route path="stm32" element={
          <RequireAuth>
            <Stm32 />
          </RequireAuth>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default MyRoutes;
