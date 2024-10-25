import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Banner from './Banner';

function Account() {
  const [loading, setLoading] = useState(true);           // Don't load until cookie checked
  const [isLoggedIn, setIsLoggedIn] = useState(false);    // Logged in boolean
  const [userInfo, setUserInfo] = useState(null);         // Account info
  const [error, setError] = useState('');                 // Error to display if no account
  const [firstName, setFirstName] = useState(userInfo?.firstName || '');
  const [lastName, setLastName] = useState(userInfo?.lastName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');



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
          setFirstName(userResponse.data.firstName);
          setLastName(userResponse.data.lastName);
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
    return <div className='bg-[#101c26] w-screen min-h-screen'><div><Banner/></div></div>;  // Could just put navbar here
  }

  // CHECK LOGIN COOKIE
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  //LOGOUT BUTTON
  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/auth/logout');
      if (response.status === 200)
        window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  //FIRST NAME LAST NAME EDIT
  const handleSave = async () => {
    if (firstName == userInfo.firstName && lastName == userInfo.lastName) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await axios.post('/api/account', {
        firstName, lastName
      });

      if (response.status === 200) {
        userInfo.firstName = firstName;   //set original database vars to new database vars
        userInfo.lastName = lastName;     //so if handleSave() with no change it doesnt make request
        setMessage("Your account has been updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      setError("Faied to update account: " + error.response?.data.message);
    }
  };

  //NEW EMAIL ADDRESS BUTTON
  const handleEmail = () => {
    window.location.href = '/changeemailaddress'
  };

  // LOGGED IN - ACCOUNT PAGE
  return (
    <div className="bg-[#101c26] dark:bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <Banner />
  
      {/* Account Info */}
      <div className="flex flex-col items-center justify-center h-full px-4">
        <div className="bg-[#13222E] shadow-lg rounded-lg p-8 w-full max-w-full mx-auto">
          {/* Your Account */}
          {userInfo ? (
            <div className="">
              <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-16">Your Account</h1>
              </div>
              
            {/* Main Box */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center max-w-lg">

                {/*FirstName LastName Edit */}
                <div className="flex space-x-4 mb-4 w-full">
                  <div className="w-1/2">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-700/20 border border-zinc-700/50 text-white rounded focus:outline-none"
                      disabled={!isEditing}
                      placeholder='First Name'
                    />
                  </div>
                  
                  <div className="w-1/2">
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-700/20 border border-zinc-700/50 text-white rounded focus:outline-none"
                      disabled={!isEditing}
                      placeholder='Last Name'
                    />
                  </div>
                    
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsEditing(true)
                          setMessage();
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {/*Email Edit */}
                <div className="flex space-x-4 mb-4 w-full">
                  <div className="w-full">
                    <input
                      type="text"
                      value={userInfo.email}
                      className="w-full px-3 py-2 bg-zinc-700/20 border border-zinc-700/50 text-white rounded focus:outline-none"
                      disabled="true"
                      placeholder='Email'
                    />
                  </div>
                    
                  <div className="flex space-x-2">
                      <button
                        onClick={handleEmail}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Change
                      </button>
                  </div>
                </div>

                {/*Logout */}
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
              </div>
            </div>
          ) : (
            <p>Loading account info...</p>
          )}
          {message && <p className="flex flex-col items-center mt-4 text-white">{message}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );  
}

export default Account;
