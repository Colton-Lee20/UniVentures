import React from 'react';

const AddAdventure = ({ isOpen, toggleWindow, onSubmit }) => {
    if (!isOpen) return null; // Don't render if window is closed

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            adventureName: e.target.adventureName.value,
            description: e.target.description.value,
            imageUrl: e.target.imageUrl.value,
            address: e.target.address.value,
        };
        onSubmit(formData); // Pass formData to the parent handler
    };

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
                <form onSubmit={onSubmit}>
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
