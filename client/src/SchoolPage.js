import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';
import { useParams, Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import Banner from './Banner';
import LocationPreview from './LocationPreview';
import AddAdventure from './AddAdventure';

const SchoolDetail = () => {
    const { schoolID } = useParams();
    const [school, setSchool] = useState(null);
    const [locations, setLocations] = useState([]);
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));  // Initialize with localStorage data
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
    

    const fetchLocations = async () => {
        try {
            const response = await fetch(`/api/school/${schoolID}/locations`); // Fetch locations
            const data = await response.json();
            setLocations(data); // Update locations state
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    useEffect(() => {
        const fetchSchoolDetails = async () => {
            try {
                const response = await axios.get(`/api/schools/${schoolID}`); // Fetch school details
                console.log(response.data);
                setSchool(response.data); // Update state with fetched data

                //LOAD SCHOOL PIC
                if (response?.data?.domain) {
                    const domain = response.data.domain;
                    const logoURL = `https://logo.clearbit.com/${domain}`;
                    setSchoolImageURL(logoURL);
                }

            } catch (error) {
                console.error('Error fetching school details:', error); // Log any error
            }
        };

        fetchSchoolDetails(); // Call the function when the component mounts
    }, [schoolID]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch(`/api/school/${schoolID}/locations`); // Fetch locations
                const data = await response.json();
                setLocations(data); // Update locations state
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations(); // Call the function when the component mounts
    }, [schoolID]);

    if (!school) return <div>Loading...</div>; 

    const toggleWindow = () => setWindowOpen(!isWindowOpen);

    const handleAddAdventure = async (event) => {
        event.preventDefault();
    
        const formData = {
            school_id: schoolID,
            name: event.target.adventureName.value,
            description: event.target.description.value,
            image_url: event.target.imageUrl.value, // Matches updated id
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
                fetchLocations(); // Refresh the displayed list of locations
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
              <div className="flex justify-end w-full">
                <button
                  onClick={toggleWindow}
                  className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-1 px-3 m-3 rounded ml-auto"
                >
                  +
                </button>
              </div>
              <div className="grid grid-cols-[1fr_4fr]">
                <div>
                  <h1 className="font-bold">Filters</h1>
                  <span>should collapse on mobile</span>
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