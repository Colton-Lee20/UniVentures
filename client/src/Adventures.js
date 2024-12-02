import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Adventures = () => {
  const { schoolID } = useParams();
  const [adventures, setadventures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchadventures = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/nearby/${schoolID}/activities`);
        if (!response.ok) throw new Error('Failed to fetch adventures');
        const data = await response.json();
        setadventures(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setadventures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchadventures();
  }, [schoolID]);

  if (loading) return <p>Loading Adventures...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {adventures.length > 0 ? (
        adventures.map((adventures) => (
          <div
            key={adventures.place_id}
            className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex flex-col items-center"
          >
            {adventures.photos && adventures.photos[0]?.photo_url ? (
              <img
                src={adventures.photos[0].photo_url}
                alt={adventures.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
            <h3 className="font-semibold text-lg text-center">{adventures.name}</h3>
            <p className="text-sm text-center text-gray-500 mt-2">{adventures.vicinity}</p>
            {adventures.rating && (
              <p className="text-sm text-center text-yellow-500 mt-2">⭐ {adventures.rating}</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No adventures found nearby.</p>
      )}
    </div>
  );
};

export default Adventures;