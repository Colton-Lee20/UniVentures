import React, { useEffect, useState } from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import Banner from './Banner';
import LocationPreview from './LocationPreview';

const SchoolDetail = () => {
    const { schoolID } = useParams();
    const [school, setSchool] = useState(null);
    const [locations, setLocations] = useState([]);
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));  // Initialize with localStorage data
    const [schoolImageURL, setSchoolImageURL] = useState('');

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

    return (
        <main>
            <Banner/>
    
            <div className="p-4">
                <div className="flex flex-col items-center mb-4">
                {schoolImageURL && (
                    <img
                      src={schoolImageURL}
                      alt="School Logo"
                      className="w-8 h-8 mr-2"
                      onError={(e) => e.target.style.display = 'none'} // Hide if image fails to load
                    />
                )}

                <h1 className="text-4xl font-bold">{school.school_name}</h1>
        
            </div>
            
                {/* Add more school details here */}
                <div className='flex justify-end w-full'>
                        <button type="submit" className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-1 px-3 rounded ml-auto">
                          Add Adventure
                        </button>
                </div>
                
                
                {/* Main Page Div*/}
                <div className="grid grid-cols-[1fr_4fr]">
                    {/* Sidebar */}
                    <div className="">
                        <h1 className="font-bold">Filters</h1>
                        <span>should collapse on mobile</span>
                    </div>

                    {/* Places Previews */}
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
        </main>
    );

};

export default SchoolDetail;