import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ActivityModal from './AdventureWindow';
import StarRating from './components/StarRating/StarRating';

const CommunityAdventures = ({ schoolID, filters }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {locations.length > 0 ? (
        locations.map((location) => (
          <div
            key={location.place_id || location.name}
            className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex flex-col items-center cursor-pointer" // Add cursor-pointer for clickability
            onClick={() => handleActivityClick(location)}
          >
            
              <img
                src={location.image_url}
                alt={location.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            <h3 className="font-semibold text-lg text-center">{location.name}</h3>
            <p className="text-sm text-center text-gray-500 mt-2">{location.description}</p>
            <p className="text-sm text-center text-gray-500 mt-2">{location.address}</p>
            {location.ratings && (
    <div className="flex justify-center items-center mt-2">
        <StarRating rating={location.ratings} variant="star-icon" />
    </div>
)}

          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No community adventures found nearby.</p>
      )}

      {selectedActivity && (
        <div>
          {console.log("Rendering modal with activity:", selectedActivity)} {/* Log here */}
          <ActivityModal
            activity={selectedActivity}
            onClose={closeModal}
          />
        </div>
      )}

    </div>
  );
};

export default CommunityAdventures;
