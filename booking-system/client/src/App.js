import React, { useEffect, useState } from 'react';

import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";

import Login from './Login';
import Homepage from './Homepage';
import Calendar from './Calendar';

import Artix7 from './interface/Artix7.js'
import Zedboard from './interface/Zedboard.js'
import Stm32 from './interface/Stm32.js'


function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="home" element={<Homepage />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="artix" element={<Artix7 />} />
                    <Route path="zedboard" element={<Zedboard />} />
                    <Route path="stm32" element={<Stm32 />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
