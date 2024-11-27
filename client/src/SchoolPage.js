import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';
import { useParams, NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import Banner from './Banner';
import LocationPreview from './LocationPreview';
import AddAdventure from './AddAdventure';

const SchoolDetail = () => {
  const { schoolID } = useParams();
  const [school, setSchool] = useState(null);
  const [locations, setLocations] = useState([]);
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const [schoolImageURL, setSchoolImageURL] = useState('');
  const [isWindowOpen, setWindowOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle('dark', newMode);
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const fetchLocations = async (category) => {
    try {
      const response = await fetch(`/api/school/${schoolID}/locations/${category}`);
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const response = await axios.get(`/api/schools/${schoolID}`);
        setSchool(response.data);

        // Load School Picture
        if (response?.data?.domain) {
          const domain = response.data.domain;
          const logoURL = `https://logo.clearbit.com/${domain}`;
          setSchoolImageURL(logoURL);
        }
      } catch (error) {
        console.error('Error fetching school details:', error);
      }
    };

    fetchSchoolDetails();
  }, [schoolID]);

  useEffect(() => {
    fetchLocations();
  }, [schoolID]);

  if (!school) return <div>Loading...</div>;

  const toggleWindow = () => setWindowOpen(!isWindowOpen);

  const handleAddAdventure = async (event) => {
    event.preventDefault();

    const formData = {
      school_id: schoolID,
      name: event.target.adventureName.value,
      description: event.target.description.value,
      image_url: event.target.imageUrl.value,
      address: event.target.address.value,
    };

    try {
      const response = await fetch('/api/adventure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toggleWindow();
        fetchLocations();
      } else {
        const errorData = await response.json();
        alert(`Error adding adventure: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding adventure:', error);
      alert('Error adding adventure');
    }
  };

  return (
    <main className="bg-white dark:bg-gray-800">
      <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
        <Banner />
        <div className="p-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 flex items-center"
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
          <div className="flex flex-col items-center mb-4">
            {schoolImageURL && (
              <img
                src={schoolImageURL}
                alt="School Logo"
                className="w-8 h-8 mr-2"
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
            <h1 className="text-4xl font-bold">{school.school_name}</h1>
          </div>

          {/* Tabs and + Button */}
<div className="flex items-center justify-between mb-6">
  {/* Tabs Section */}
  <nav className="flex-1 flex justify-center space-x-6">
    <NavLink
      to="activities"
      className={({ isActive }) =>
        `px-4 py-2 text-lg font-medium ${
          isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'
        }`
      }
    >
      Activities
    </NavLink>
    <NavLink
      to="clubs"
      className={({ isActive }) =>
        `px-4 py-2 text-lg font-medium ${
          isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'
        }`
      }
    >
      Clubs
    </NavLink>
    <NavLink
      to="restaurant"
      className={({ isActive }) =>
        `px-4 py-2 text-lg font-medium ${
          isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'
        }`
      }
    >
      Restaurants
    </NavLink>
    <NavLink
      to="stores"
      className={({ isActive }) =>
        `px-4 py-2 text-lg font-medium ${
          isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'
        }`
      }
    >
      Stores
    </NavLink>
    </nav>
    <button
    onClick={toggleWindow}
    className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-1 px-3 rounded ml-4"
    >
      +
      </button>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <LocationPreview key={location.id} location={location} />
            ))}
          </div>
          <div className="mt-8">
            <Outlet />
          </div>
        </div>
        <AddAdventure
          isOpen={isWindowOpen}
          toggleWindow={toggleWindow}
          onSubmit={handleAddAdventure}
        />
      </div>
    </main>
  );
};

export default SchoolDetail;

