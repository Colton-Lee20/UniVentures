import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./css/input.css";

function App() {
  return (
    <div className="bg-[#ffffff] w-screen h-screen overflow-hidden">
      {/* navbar */}
      <div className='w-screen py-6 px-5 lg:px-10 bg-[#252525] flex justify-between text-neutral-300'>
        <span className='text-lg font-semibold'>
          U V
        </span>

        <ul className='hidden md:flex items-center space-x-5'>
          <li>
            About
          </li>
          <li>
            Contact
          </li>
          <li>
            Account
          </li>
        </ul>

        {/*Hamburger Menu*/}
        <button className='space-y-1 group md:hidden'>
          <div className='w-6 h-1 bg-white'></div>
          <div className='w-6 h-1 bg-white'></div>
          <div className='w-6 h-1 bg-white'></div>

          {/* Menu */}
          <ul className='bg-[252525] w-screen pb-10 absolute -top-full group-focus:top-0 right-0 duration-150 flex flex-col space-y-3 justify-end'>
            <button className='px-10 py-8 relative ml-auto'></button>
            <li className='flex justify-center w-full py-4 bg-[#252525] hover:bg-[#D3D3D3]'>
              About
            </li>
            <li className='flex justify-center w-full py-4 bg-[#252525] hover:bg-[#D3D3D3]'>
              Contact
            </li>
            <li className='flex justify-center w-full py-4 bg-[#252525] hover:bg-[#D3D3D3]'>
              Account
            </li>
          </ul>
        </button>

      </div>
      

    </div>
  );
}

const DataComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from Flask backend
    axios.get('http://localhost:5000/get_data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div>
      <h1>Data from MySQL</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
