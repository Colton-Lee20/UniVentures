import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import logo from './Images/logo.webp'

const RenderBanner = () => {

  // State to track if the menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
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
          <button className='space-y-1 group md:hidden' onClick={toggleMenu}>
            <div className='w-6 h-1 bg-white'></div>
            <div className='w-6 h-1 bg-white'></div>
            <div className='w-6 h-1 bg-white'></div>

            {/* Menu open and close*/}
            <ul className={`bg-[#101c26] w-screen pb-5 absolute right-0 duration-300 flex flex-col space-y-3 justify-end ${
            isMenuOpen ? 'top-20' : '-top-full'
            }`}>
              
              <li className='flex justify-center w-full py-4 bg-[#101c26] hover:bg-[#D3D3D3]'>
                <Link to="/about" className='w-full h-full flex justify-center items-center'>About</Link>
              </li>
              <li className='flex justify-center w-full py-4 bg-[#101c26] hover:bg-[#D3D3D3]'>
                <Link to="/contact" className='w-full h-full flex justify-center items-center'>Contact</Link>
              </li>
              <li className='flex justify-center w-full py-4 bg-[#101c26] hover:bg-[#D3D3D3]'>
                <Link to="/account" className='w-full h-full flex justify-center items-center'>Account</Link>
              </li>
            </ul>
          </button>

        </div>
  );
};

export default RenderBanner;