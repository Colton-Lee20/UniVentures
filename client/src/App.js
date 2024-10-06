import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./css/input.css";

import { BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';

import MainPage from './MainPage';
import Login from './Login';
import Signup from './Signup';
import Account from './Account';

function App() {
  return (
    
    <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path='/Login' element={< Login />}></Route> 
          <Route path='/Signup' element={< Signup />}></Route>
          <Route path='/Account/*' element={< Account />}></Route>   
        </Routes>
    </Router>
    
  );
}

export default App;
