import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Clubs = () => {
  const { schoolID } = useParams();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/nearby/${schoolID}/clubs`);
        if (!response.ok) throw new Error('Failed to fetch clubs');
        const data = await response.json();
        setClubs(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [schoolID]);

  if (loading) return <p>Loading clubs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {clubs.length > 0 ? (
        clubs.map((clubs) => (
          <div
            key={clubs.place_id}
            className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex flex-col items-center"
          >
            {clubs.photos && clubs.photos[0]?.photo_url ? (
              <img
                src={clubs.photos[0].photo_url}
                alt={clubs.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
            <h3 className="font-semibold text-lg text-center">{clubs.name}</h3>
            <p className="text-sm text-center text-gray-500 mt-2">{clubs.vicinity}</p>
            {clubs.rating && (
              <p className="text-sm text-center text-yellow-500 mt-2">⭐ {clubs.rating}</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No clubs found nearby.</p>
      )}
    </div>
  );
};

export default Clubs;
