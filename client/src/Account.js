import React, { useState, useEffect } from 'react';
import {Navigate } from 'react-router-dom';
import axios from 'axios';
import Banner from './Banner';
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
      return <div><Banner/></div>;  // could just put navbar here
    }




    //CHECK LOGIN COOKIE
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    


    //LOGGED IN - ACCOUNT PAGE
    //need to add a log out button. needs to delete session cookie
    return (

        /*  NAVBAR  */
        <div className="bg-[#ffffff] dark:bg-gray-800 w-screen h-screen overflow-hidden">
        {/* navbar */}
          <Banner/>
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