import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Star from './Star';
import StarRating from './StarRating';

const StoreCard = ({ store, refresh }) => {
    const [selectedStarCount, setSelectedStarCount] = useState(0);
    const token = localStorage.getItem('token');

    const submitRating = async () => {
        setSelectedStarCount(0);
        try {
            const response = await fetch(`http://localhost:5000/api/stores/${store._id}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating: selectedStarCount })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit rating');
            }

            refresh();
        } catch (error) {
            console.error('Error submitting rating:', error.message);
        }
    };

    const EditRating = async () => {
        setSelectedStarCount(0);
        try {
            const response = await fetch(`http://localhost:5000/api/stores/${store._id}/rate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating: selectedStarCount })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit rating');
            }

            refresh();
        } catch (error) {
            console.error('Error submitting rating:', error.message);
        }
    }


    return (
        <div className="m-4 p-4 w-2/7 rounded shadow">
            <h3 className="text-2xl font-bold">{store.name}</h3>
            <p className="text-xl font-bold text-gray-600">{store.address}</p><div className="mt-2 flex flex-row items-center gap-1"><strong className='text-xl'>{store.averageRating}.0</strong><StarRating rating={store.averageRating} /> ({store.storeRatings.length} ratings)</div>

            <div >Your Rating: <StarRating rating={store.userRating || 0} /></div>
            <div className="flex items-center">
                <Star
                    selectedStarCount={selectedStarCount}
                    setSelectedStarCount={setSelectedStarCount}
                />
                {store.userRating > 0 ? (<button onClick={EditRating} className="bg-blue-500 cursor-pointer text-black ml-2 px-3 py-2 rounded">Edit Rating</button>) : (<button onClick={submitRating} className="bg-blue-500 cursor-pointer text-black ml-2 px-3 py-2 rounded">Submit Rating</button>)}
            </div>
        </div>
    );
};

export default StoreCard;
