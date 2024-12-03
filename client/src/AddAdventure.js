import React, { useEffect, useState, useRef } from 'react';
import {ChevronDownIcon } from '@heroicons/react/solid';



const AddAdventure = ({ isOpen, toggleWindow, onSubmit }) => {
    
	const dropdownRef = useRef(null);
    const [pendingFilters, setPendingFilters] = useState({type: ''});
    const [typeFilterOpen, setTypeFilterOpen] = useState(false);
    const toggleTypeFilter = () => setTypeFilterOpen(!typeFilterOpen);
    const activeFilters = ['Activity', 'Bar', 'Class', 'Club', 'Event', 'Restaurant', 'Store'];

    const typeMappings = {
        'Activity': 'A',
        'Bar': 'B',
        'Class': 'CA',
        'Club': 'CB',
        'Event': 'E',
        'Restaurant': 'R',
        'Store': 'S'
    };
	
	const handleTypeSelect = (type) => {
        setPendingFilters((prev) => ({ ...prev, type: typeMappings[type] }));
        setTypeFilterOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            adventureName: e.target.adventureName.value,
            type: pendingFilters.type,
            description: e.target.description.value,
            imageUrl: e.target.imageUrl.value,
            address: e.target.address.value,
            rating: parseFloat(e.target.rating.value),
        };
        onSubmit(formData); // Pass formData to the parent handler
    };

    if (!isOpen) return null; // Don't render if window is closed

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96 relative">
                <button
                    type="button"
                    onClick={toggleWindow}
                    className="absolute top-2 right-2 bg-gray-100 text-gray-700 px-2 py-1 rounded font-bold"
                >
                    X
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">
                            Adventure Name
                        </label>
                        <input
                            type="text"
                            id="adventureName"
                            className="w-full p-2 border rounded"
                            placeholder="Enter adventure name"
                            required
                        />
                    </div>
                    <label className="block text-sm font-bold mb-2">
                            Type
                    </label>
                    {/* Type Dropdown */}
                    <div
                        ref={dropdownRef}
                        className="relative">

                        <button
                            type="button"
                            onClick={toggleTypeFilter}
                            className="w-full border flex items-center justify-between px-2 py-2 mb-2 rounded"
                        >
                             <span>{pendingFilters.type ? Object.keys(typeMappings).find(key => typeMappings[key] === pendingFilters.type) : ''}</span>
                            <ChevronDownIcon className="h-5 w-5" />
                        </button>
                        {typeFilterOpen && (
                            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                                {activeFilters.map((type) => (
                                    <li
                                        key={type}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleTypeSelect(type)}
                                    >
                                        {type}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>



                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            className="w-full p-2 border rounded"
                            placeholder="Enter description"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">
                            Image Url
                        </label>
                        <input
                            type="text"
                            id="imageUrl"
                            className="w-full p-2 border rounded"
                            placeholder="Enter Image Url"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            className="w-full p-2 border rounded"
                            placeholder="Enter address"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">
                            Rating out of 5
                        </label>
                        <input
                            type="number"
                            id="rating"
                            className="w-full p-2 border rounded"
                            placeholder="Enter rating number out of 5"
                            min="1"
                            max="5"
                            step="0.1" 
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded"
                        >
                            Add Adventure
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAdventure;
