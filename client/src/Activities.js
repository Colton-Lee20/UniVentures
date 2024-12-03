import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ActivityModal from './AdventureWindow';

const Activities = () => {
  const { schoolID } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/nearby/${schoolID}/activities`);
        if (!response.ok) throw new Error('Failed to fetch activities');
        const data = await response.json();

        // Filter unwanted activities
        const filteredData = data.filter(activity =>   
          !activity.name.toLowerCase().includes('example unwanted name') // Exclude specific names
        );

        setActivities(filteredData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [schoolID]);

  const handleActivityClick = (activity) => 
  {
    setSelectedActivity(activity);
  };

  const closeModal = () => 
  {
    setSelectedActivity(null);
  };

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div
            key={activity.place_id || activity.name}
            className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex flex-col items-center cursor-pointer" // Add cursor-pointer for clickability
            onClick={() => handleActivityClick(activity)}
          >
            {activity.photos && activity.photos[0]?.photo_url ? (
              <img
                src={activity.photos[0].photo_url}
                alt={activity.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
            <h3 className="font-semibold text-lg text-center">{activity.name}</h3>
            <p className="text-sm text-center text-gray-500 mt-2">{activity.vicinity}</p>
            {activity.rating && (
              <p className="text-sm text-center text-yellow-500 mt-2">⭐ {activity.rating}</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No activities found nearby.</p>
      )}

      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={closeModal}
        />
      )}

    </div>
    
  );
};

export default Activities;
