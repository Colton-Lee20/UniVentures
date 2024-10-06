import React, { useState, useEffect } from 'react';
import {Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from './Images/logo.webp'
function Account() {

    const [loading, setLoading] = useState(true);           //dont load until cookie checked
    const [isLoggedIn, setIsLoggedIn] = useState(false);    //logged in boolean
    const [userInfo, setUserInfo] = useState(null);         //account info
    const [error, setError] = useState('');                 //error to display if no account

    //GET LOGIN COOKIE
    useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          
          const response = await axios.get('/api/auth/check-login'); //api call
          
          //LOGGED IN
          if (response.data.isLoggedIn) {
            setIsLoggedIn(true);
            const userResponse = await axios.get('/api/account');
            setUserInfo(userResponse.data);
          }

          //NOT LOGGED IN
        } catch (error) {
          console.error('Error checking login status:', error);
          setError(error.response?.data?.message || 'Something when wrong getting account information');

          //DONE CHECKING
        } finally {
          setLoading(false); //Done checking for cookie
        }
      };
      checkLoginStatus();
    }, []);
    


    //DONT MOVE DOWN TO LOGIN OR ACCOUNT PAGE YET - need to check if logged in already
    if (loading) {
      return <div>Loading...</div>;  // could just put navbar here
    }




    //CHECK LOGIN COOKIE
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    


    //LOGGED IN - ACCOUNT PAGE
    return (

        /*  NAVBAR  */
        <div className="bg-[#ffffff] dark:bg-gray-800 w-screen h-screen overflow-hidden">
        {/* navbar */}
        <div className='w-screen py-2 px-5 lg:px-10 bg-[#101c26] flex justify-between text-neutral-300'>
          <span className='text-lg font-semibold'>
          <Link to="/"><img src={logo} alt="Logo" style={{ width: '80px', height: 'auto' }}/></Link>
          </span>

          <ul className='hidden md:flex items-center space-x-5'>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/account">Account</Link></li>
          </ul>

          {/*Hamburger Menu*/}
          <button className='space-y-1 group md:hidden'>
            <div className='w-6 h-1 bg-white'></div>
            <div className='w-6 h-1 bg-white'></div>
            <div className='w-6 h-1 bg-white'></div>

            {/* Menu */}
            <ul className='bg-[252525] w-screen pb-10 absolute -top-full group-focus:top-0 right-0 duration-150 flex flex-col space-y-3 justify-end'>
              
              <li className='flex justify-center w-full py-4 bg-[#252525] hover:bg-[#D3D3D3]'>
                <Link to="/about">About</Link>
              </li>
              <li className='flex justify-center w-full py-4 bg-[#252525] hover:bg-[#D3D3D3]'>
                <Link to="/contact">Contact</Link>
              </li>
              <li className='flex justify-center w-full py-4 bg-[#252525] hover:bg-[#D3D3D3]'>
                <Link to="/account">Account</Link>
              </li>
            </ul>
          </button>


          {/* REST OF PAGE */}

            </div>
            <div className="account-info">
                {userInfo ? (
                    <div>
                        <h1>Account ID: {userInfo.id}</h1>
                        
                        <p>Email: {userInfo.email}</p>
                    </div>
                ) : (
                    <p>Loading account info...</p>
                )}
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default Account;