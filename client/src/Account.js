import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Banner from './Banner';

function Account() {
  const [loading, setLoading] = useState(true);           // Don't load until cookie checked
  const [isLoggedIn, setIsLoggedIn] = useState(false);    // Logged in boolean
  const [userInfo, setUserInfo] = useState(null); 
  const [error, setError] = useState('');                 // Error to display if no account
  const [firstName, setFirstName] = useState(userInfo?.firstName || '');
  const [lastName, setLastName] = useState(userInfo?.lastName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [schoolPlaceholder, setSchoolPlaceholder] = useState('');
  const [schoolImageURL, setSchoolImageURL] = useState('');
  const [reviews, setReviews] = useState([]);             // State for reviews
  const [reviewsLoading, setReviewsLoading] = useState(true); // State to handle review loading


  // GET LOGIN COOKIE
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loginResponse = await axios.get('/api/auth/check-login');
        
        if (loginResponse.data.isLoggedIn) {
          setIsLoggedIn(true);

          // Fetch account information
          const accountResponse = await axios.get('/api/account');
          const accountData = accountResponse.data;
          setUserInfo(accountData);
          setFirstName(accountData.firstName);
          setLastName(accountData.lastName);
          
          // Fetch user reviews
          fetchReviews(accountData.id);

        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setError(error.response?.data?.message || 'Something went wrong getting account information');
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  // Fetch reviews based on user_id
  const fetchReviews = async (userId) => {
    console.log("Fetching reviews for user_id:", userId); // Check if user_id is correct
    try {
      const response = await axios.get(`/api/reviews/user?user_id=${userId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  // Update schoolPlaceholder after userInfo is set
  useEffect(() => {
    if (userInfo) {
      setSchoolPlaceholder(
        userInfo.schoolName || "School with your email is not in the system. Please contact us to add it!"
      );
    }
  }, [userInfo]);
  // Update schoolPlaceholder after userInfo is set
  useEffect(() => {
    if (userInfo) {
      setSchoolPlaceholder(
        userInfo.schoolName || "School with your email is not in the system. Please contact us to add it!"
      );
    }
  }, [userInfo]);

  //LOAD SCHOOL PIC
  useEffect(() => {
      if (userInfo?.email) {
        const domain = userInfo.email.split('@')[1];
        const logoURL = `https://logo.clearbit.com/${domain}`;
        setSchoolImageURL(logoURL);
      }
  }, [userInfo]);

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
      if (response.status === 200) {
        window.location.href = '/'
      }
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
        
        //localStorage.setItem('userInfo', JSON.stringify(userInfo));         //IMPORTANT: update local storage names for changes
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
                <h1 className="text-4xl font-bold mb-8 cursor-default">Your Account</h1>
              </div>
              
            {/* Main Box */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center max-w-lg">

                {/* User's School */}
                <div className="flex items-center justify-center max-w-lg w-full mb-4 cursor-default">
                  {/* School Icon */}
                  {schoolImageURL && (
                    <img
                      src={schoolImageURL}
                      alt="School Logo"
                      className="w-8 h-8 mr-2 mb-1"
                      onError={(e) => e.target.style.display = 'none'} // Hide if image fails to load
                    />
                  )}

                  {/* School Placeholder Text */}
                  <p className="text-sm font-medium">{schoolPlaceholder}</p>


                </div>

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
                        className="bg-teal-500 text-white font-bold py-2 px-4 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsEditing(true)
                          setMessage();
                        }}
                        className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
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
                        className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Change
                      </button>
                  </div>
                </div>

                {/*Logout */}
                <button
                  className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
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
        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Your Reviews</h2>
          {reviewsLoading ? (
            <p>Loading reviews...</p>
          ) : (
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-600 pb-4">
                    <h3 className="text-lg font-semibold">{review.review_text}</h3>
                    <p>{review.comment}</p>
                    <p className="text-sm text-gray-400">Rating: {review.rating} / 5</p>
                  </div>
                ))
              ) : (
                <p>No reviews found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );  
}

export default Account;
