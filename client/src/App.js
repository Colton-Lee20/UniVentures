import React from 'react';
import { Navigate } from 'react-router-dom';
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
import Restaurant from './Restaurant';
import Stores from './Stores';
import Activities from './Activities';
import Clubs from './Clubs';
import RenderBanner from './RenderBanner';
import { AuthProvider } from './AuthContext';
import PublicAdventures from './Adventures';
import CommunityAdventures from './CommunityAdventures';


function App() {
  return (
    <AuthProvider>
    <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path='/About' element={< About />}></Route> 
          <Route path='/Contact' element={< Contact />}></Route> 
          <Route path='/Login' element={< Login />}></Route> 
          <Route path='/Signup' element={< Signup />}></Route>
          <Route path='/Account/*' element={< Account />}></Route>
          <Route path='*' element={< NotFoundPage />}></Route>




          <Route path="/school/:schoolID" element={<SchoolDetail />}>

            {/* Default redirect to public-adventures */}
            <Route index element={<Navigate to="adventures" />} />
            <Route path="adventures" element={<PublicAdventures />} />
            <Route path="community" element={<CommunityAdventures />} />

            <Route path="restaurant" element={<Restaurant />} />
            <Route path="stores" element={<Stores />} />
            <Route path="activities" element={<Activities />} />
            <Route path="clubs" element={<Clubs />} />
          </Route>
          </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
