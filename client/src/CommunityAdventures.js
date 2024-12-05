import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {RefreshIcon, StarIcon} from '@heroicons/react/solid';
import ActivityModal from './AdventureWindow';
import StarRating from './components/StarRating/StarRating';

const CommunityAdventures = ({ schoolID, filters }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [surpriseLocation, setSurpriseLocation] = useState(null)

  useEffect(() => {
    const fetchLocations = async () => {
        try {
            const queryString = new URLSearchParams(filters).toString();
            const url = `/api/school/${schoolID}/locations${queryString ? '?' + queryString : ''}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch locations');
            }

            const data = await response.json();
            setLocations(data);

        } catch (error) {
            console.error('Error fetching locations:', error);
        }
        finally {
            setLoading(false);
        }
    };
    fetchLocations(); // Call the function when the component mounts
}, [schoolID, filters]);

  if (loading) return <p>Loading Adventures...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleActivityClick = (location) => 
    {
      console.log('Activity clicked:', location); 
      setSelectedActivity(location);
    };
  
    const closeModal = () => 
    {
      setSelectedActivity(null);

    };
  
    
    const handleReset = () => {
      setSurpriseLocation(null);
    };
  
    const handleSurprise = async () => {
      try {
        const response = await fetch(`/api/random-location?school_id=${encodeURIComponent(schoolID)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch a random location");
        }
        const data = await response.json();
    
        console.log("Surprise location data:", data); // Debugging log
    
        // Update the surprise location state
        setSurpriseLocation(data);
      } catch (error) {
        console.error("Error fetching random location:", error);
      }
    };
    

  if (loading) return <p>Loading Adventures...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-end items-center mb-4 gap-4">
        {/* Surprise Me Button */}
        <button
          onClick={handleSurprise} // Call handleSurprise when the button is clicked
          className="flex items-center gap-2 bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition-all"
        >
          <StarIcon className="h-6 w-6" />
          Surprise Me
        </button>
  
        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-gray-400 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-500 transition-all"
        >
          <RefreshIcon className="h-6 w-6" />
          Reset
        </button>
      </div>
  
      {/* Display Surprise Location */}
      {surpriseLocation ? (
        <div 
        onClick={() => handleActivityClick(surpriseLocation)}
        className="mt-6 p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800"
        >
          <img
            src={surpriseLocation.image_url}
            alt={surpriseLocation.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-center">
            {surpriseLocation.name}
          </h2>
          <p className="text-center text-gray-600 mb-4">
            {surpriseLocation.description}
          </p>
          <p className="text-center text-gray-600">
            {surpriseLocation.address}
          </p>
          {surpriseLocation.ratings && (
            <div className="flex justify-center items-center mt-2">
              <StarRating rating={surpriseLocation.ratings} variant="star-icon" />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {locations.length > 0 ? (
            locations.map((location) => (
              <div
                key={location.place_id || location.name}
                className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex flex-col items-center cursor-pointer"
                onClick={() => handleActivityClick(location)}
              >
                <img
                  src={location.image_url}
                  alt={location.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg text-center">
                  {location.name}
                </h3>
                <p className="text-sm text-center text-gray-500 mt-2">
                  {location.description}
                </p>
                <p className="text-sm text-center text-gray-500 mt-2">
                  {location.address}
                </p>
                {location.ratings && (
                  <div className="flex justify-center items-center mt-2">
                    <StarRating rating={location.ratings} variant="star-icon" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No community adventures found nearby.
            </p>
          )}
        </div>
      )}
  
      {/* Render the activity modal if an activity is selected */}
      {selectedActivity && (
        <ActivityModal activity={selectedActivity} onClose={closeModal} />
      )}
    </div>
  );
}

export default CommunityAdventures;
