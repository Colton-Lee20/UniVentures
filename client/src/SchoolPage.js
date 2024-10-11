import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
            </div>
        </main>
    );
};

export default SchoolDetail;