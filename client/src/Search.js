import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [schools, setSchools] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`/api/schools?query=${query}`);
            setSchools(response.data);
        } catch (error) {
            console.error('Error fetching schools:', error);
        }
        };

    const handleSchoolClick = (schoolID) => {
        navigate(`/school/${schoolID}`);
    };


    return (
        <main className='flex flex-col h-screen w-screen items-center justify-start bg-[#101c26]'>
            <div className='text-white font-serif text-5xl mb-4 pt-40'>
                UniVentures
            </div>
            <div className='flex w-96 rounded bg-white'>
                <form onSubmit={handleSearch} className='flex w-full'>
                    <input
                    type='search'
                    name='search'
                    id='search'
                    placeholder='Search'
                    onChange={(e) => setQuery(e.target.value)}  // Update query state
                    className='w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none'
                    />
                    <button className='m-2 rounded bg-teal-800 px-4 py-2 text-white' type='submit'>
                        Search
                    </button>
                </form>
            </div>
            {/* Display search results */}
            <div className='mt-4 w-96 h-20'>
                <ul className='bg-white rounded shadow-lg max-h-60 overflow-y-auto'>
                    {schools.length > 0 ? (
                        schools.map((school) => (
                            <li
                                key={school.id}
                                onClick={() => handleSchoolClick(school.id)}  // Navigate on click
                                className='cursor-pointer hover:bg-gray-200 p-2'
                            >
                                {school.school_name}
                            </li>
                        ))
                    ) : (
                        <li className='p-2 text-gray-500'>No results found</li>
                    )}
                </ul>
            </div>
        </main>   
    );

};


export default SearchBar;