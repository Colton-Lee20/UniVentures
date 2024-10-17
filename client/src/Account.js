import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Banner from './Banner';

function Account() {
  const [loading, setLoading] = useState(true);           // Don't load until cookie checked
  const [isLoggedIn, setIsLoggedIn] = useState(false);    // Logged in boolean
  const [userInfo, setUserInfo] = useState(null);         // Account info
  const [error, setError] = useState('');                 // Error to display if no account

  // GET LOGIN COOKIE
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/auth/check-login'); // API call
        
        // LOGGED IN
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
          const userResponse = await axios.get('/api/account');
          setUserInfo(userResponse.data);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setError(error.response?.data?.message || 'Something went wrong getting account information');
      } finally {
        setLoading(false); // Done checking for cookie
      }
    };
    checkLoginStatus();
  }, []);

  // DONT MOVE DOWN TO LOGIN OR ACCOUNT PAGE YET - need to check if logged in already
  if (loading) {
    return <div><Banner/></div>;  // Could just put navbar here
  }

  // CHECK LOGIN COOKIE
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // LOGGED IN - ACCOUNT PAGE
  return (
    <div className="bg-[#0d0d0d] dark:bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <Banner />
  
      {/* Account Info */}
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
          {userInfo ? (
            <div>
              <h1 className="text-2xl font-bold mb-4">Account Details</h1>
              <div className="mb-4">
                <p className="text-lg">Account ID: <span className="font-semibold">{userInfo.id}</span></p>
              </div>
              <div className="mb-4">
                <p className="text-lg">Email: <span className="font-semibold">{userInfo.email}</span></p>
              </div>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Log Out
              </button>
            </div>
          ) : (
            <p>Loading account info...</p>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );  
}

export default Account;
