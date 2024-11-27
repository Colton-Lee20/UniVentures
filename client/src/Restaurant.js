import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Restaurant = () => {
  const { schoolID } = useParams();
  const [restaurant, setRestaurant] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true); // Start loading state
        const response = await fetch(`/api/nearby/${schoolID}/restaurant`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        setRestaurant(data); // Set the fetched data into the state
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message); // Set the error message
        setRestaurant([]); // Clear the restaurant list
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchRestaurant();
  }, [schoolID]);

  if (loading) return <p>Loading restaurants...</p>; // Show loading indicator
  if (error) return <p className="text-red-500">{error}</p>; // Show error message

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {restaurant.length > 0 ? (
        restaurant.map((rest) => (
          <div
            key={rest.place_id}
            className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex flex-col items-center"
          >
            {rest.photos && rest.photos[0]?.photo_url ? (
              <img
                src={rest.photos[0].photo_url}
                alt={rest.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
            <h3 className="font-semibold text-lg text-center">{rest.name}</h3>
            <p className="text-sm text-center text-gray-500 mt-2">{rest.vicinity}</p>
            {rest.rating && (
              <p className="text-sm text-center text-yellow-500 mt-2">⭐ {rest.rating}</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No restaurants found nearby.</p>
      )}
    </div>
  );
};

export default Restaurant;
