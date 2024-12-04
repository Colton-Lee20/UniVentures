import React, { useState, useEffect } from 'react';

const ActivityModal = ({ activity, onClose }) => {

    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        //set vars if a public adventure
        if (activity.photos && activity.photos[0]?.photo_url) {
            setIsPublic(true);
            activity.image_url = activity.photos[0]?.photo_url;
            activity.address = activity.vicinity;
        }
    }

    )

    if (!activity) {
        return null; // Return null if no activity is passed, just for safety
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 shadow-lg">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">{activity.name}</h2>
                    <button
                        className="text-gray-500 dark:text-gray-200 hover:text-red-500 transition-all"
                        onClick={onClose}
                    >
                        ✖
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex flex-col space-y-4 max-h-[80vh] overflow-y-auto px-5">
                    <img
                        src={activity.image_url}
                        alt={activity.name}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    {/* Render description only for community adventures */}
                    {!isPublic && (
                        <div>
                            <h3 className="text-xl text-gray-700 dark:text-gray-300 font-bold">Description</h3>
                            <p className="text-gray-600 dark:text-gray-400">{activity.description}</p>
                        </div>
                    )}
                    <div>
                        <h3 className="text-xl text-gray-700 dark:text-gray-300 font-bold">Address</h3>
                        <p className="text-gray-600 dark:text-gray-400">{activity.address}</p>
                    </div>
                    {activity.ratings && (
                        <div>
                            <h3 className="text-xl text-gray-700 dark:text-gray-300 font-bold">Ratings</h3>
                            <p className="text-yellow-500">⭐ {activity.ratings}</p>
                        </div>
                    )}
                    <div>
                        <h3 className="text-xl text-gray-700 dark:text-gray-300 font-bold">Write a Review</h3>

                        <div className="mt-4">
                            {/* Review Textarea */}
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                rows="4"
                                placeholder="Write your review here..."
                            />
                        </div>
                        <div className="flex justify-end mt-2">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl text-gray-700 dark:text-gray-300 font-bold">View Reviews</h3>

                    </div>

                </div>


            </div>
        </div>
    );
};


export default ActivityModal;
