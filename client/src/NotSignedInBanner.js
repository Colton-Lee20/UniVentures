import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import logo from './Images/logo.webp'

const RenderLoginBanner = () => {

  return (
    <div className='w-screen py-2 px-5 lg:px-10 bg-[#101c26] flex justify-between text-neutral-300'>
          <span className='text-lg font-semibold'>
          <Link to="/"><img src={logo} alt="Logo" style={{ width: '80px', height: 'auto' }}/></Link>
          </span>

          <ul className='hidden md:flex items-center space-x-5'>
            {/* Adding the Sign In button */}
            <li>
              <Link
                to="/signin"
                className="bg-white text-black py-2 px-4 rounded-full hover:bg-gray-200 transition-colors"
                style={{ fontWeight: 'bold' }}
              >
                Sign In
              </Link>
            </li>
          </ul>
        </div>
  );
};

export default RenderLoginBanner;