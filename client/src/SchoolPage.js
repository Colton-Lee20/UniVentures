import React, { useEffect, useState } from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import Banner from './Banner';

const SchoolDetail = () => {
    const { schoolID } = useParams();
    const [school, setSchool] = useState(null);

    useEffect(() => {
        const fetchSchoolDetails = async () => {
            try {
                const response = await axios.get(`/api/schools/${schoolID}`); // Fetch school details
                console.log(response.data);
                setSchool(response.data); // Update state with fetched data
            } catch (error) {
                console.error('Error fetching school details:', error); // Log any error
            }
        };

        fetchSchoolDetails(); // Call the function when the component mounts
    }, [schoolID]);

    if (!school) return <div>Loading...</div>; 

    return (
        <main>
            <Banner/>
    
            <div className="p-4">
                <h1 className="text-2xl font-bold">{school.school_name}</h1>
            
                {/* Add more school details here */}
                <nav>
                    <ul className="flex space-x-6 justify-center mb-6">
                        <li>
                            <Link to={`/school/${schoolID}/restaurant`} className="tab-link">
                                Restaurant
                            </Link>
                        </li>
                        <li>
                            <Link to={`/school/${schoolID}/stores`} className="tab-link">
                                Stores
                            </Link>
                        </li>
                        <li>
                            <Link to={`/school/${schoolID}/activities`} className="tab-link">
                                Activities
                            </Link>
                        </li>
                        <li>
                            <Link to={`/school/${schoolID}/clubs`} className="tab-link">
                                Clubs
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div>
                    <Outlet />
                </div>
            </div>
        </main>
    );

};

export default SchoolDetail;