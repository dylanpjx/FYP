import React, { useContext } from 'react';
import { Navigate, Routes, Route, BrowserRouter as Router, useLocation } from "react-router-dom";

import { AuthContext } from './AuthProvider';
import Login from './Login';
import Register from './Register';
import Homepage from './Homepage';
import Calendar from './Calendar';

import Artix7 from './interface/Artix7';
import Zedboard from './interface/ZedBoard';
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
                <Route path="calendar" element={
                    <RequireAuth>
                        <Calendar />
                    </RequireAuth>
                } />
                <Route path="artix" element={
                    <RequireAuth>
                        <Artix7 />
                    </RequireAuth>
                } />
                <Route path="zedboard" element={
                    <RequireAuth>
                        <Zedboard />
                    </RequireAuth>
                } />
                <Route path="stm32" element={
                    <RequireAuth>
                        <Stm32 />
                    </RequireAuth>
                } />
            </Routes>
        </Router>
    )
}

export default MyRoutes;
