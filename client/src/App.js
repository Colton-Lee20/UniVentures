import React from 'react';
import "./css/input.css";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './MainPage';
import About from './About';
import Contact from './Contact';
import Login from './Login';
import Signup from './Signup';
import Account from './Account';
import NotFoundPage from './NotFoundPage';
import SchoolDetail from './SchoolPage';

function App() {
  return (
    
    <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path='/About' element={< About />}></Route> 
          <Route path='/Contact' element={< Contact />}></Route> 
          <Route path='/Login' element={< Login />}></Route> 
          <Route path='/Signup' element={< Signup />}></Route>
          <Route path='/Account/*' element={< Account />}></Route>
          <Route path='*' element={< NotFoundPage />}></Route>
          <Route path="/school/:schoolID" element={<SchoolDetail />} /> 
        </Routes>
    </Router>
    
  );
}

export default App;
