import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/input.css';
import Banner from './Banner';
import SearchBar from './Search';
import RenderLoginBanner from './NotSignedInBanner';
import Login from './Login';
import Signup from './Signup';
import EmailSignUp from './SignUpEmail';

function MainPage() {
  return (
      // Main container with full height and width
      <div className="bg-[#101c26] dark:bg-gray-800 overflow-auto flex flex-col items-center min-h-screen">
          
          {/* Login banner at the top */}
          <RenderLoginBanner />

          {/* Centered content */}
          <div className='flex flex-col items-center bg-[#101c26] '>
              
              {/* Title */}
              <div className='text-white font-serif text-7xl  pt-32'>
                  UniVentures
              </div>

              {/* Tagline very close to the title */}
              <div className='text-white font-serif text-xl'>
                  Find Your Next Campus Adventure
              </div>

              {/* Email sign-up form, very close to the tagline */}
              <div className="mt-">
                  <EmailSignUp />

      {/* My thoughts with EmailSignUp is I want them to go to another "create an account" page
        where they can select school and all the other info we need
        (This is also how netflix does it you want it to be as simple as possible for the first move'
        for user retention) - Marc*/}

        
              </div>
          </div>
      </div>
  );
}

export default MainPage;


