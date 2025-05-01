import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import { LogOut } from 'lucide-react';

const StoreOwnerDashboard = () => {
    const [ratings, setRatings] = useState([]);
    const [averageRatings, setAverageRatings] = useState(0);
    const [ownerStoreName, setOwnerStoreName] = useState([]);
    const navigate = useNavigate();

    const fetchStoreRatings = async () => {
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:5000/api/owner/ratings', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        const { averageRating, ratings } = data
        setRatings(ratings);
        setAverageRatings(averageRating);
    };

    const fetchOwnerStore = async() => {
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:5000/api/owner/stores', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        setOwnerStoreName(data);
        console.log(data)
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const handlePasswordChange = () => {
        navigate('/passwordChange', { state: { from: 'storeowner' } });
    }

    useEffect(() => {
        fetchStoreRatings();
        fetchOwnerStore();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-blue-400 to-white flex flex-col">
            <div className="flex my-4 mx-2 justify-between items-center mb-6">
                <h1 className="text-5xl font-bold">Store Owner Dashboard</h1>
                <div className="flex gap-2">
                    <button onClick={handleLogout} className=" bg-red-500 text-white cursor-pointer px-4 py-2 rounded flex items-center gap-2"><LogOut /> Logout</button>
                    <button onClick={handlePasswordChange} className="px-4 cursor-pointer mx-2 py-2 bg-red-500 text-white rounded">Password Change</button>
                </div>
            </div>

            <div className="p-4 mb-6 rounded shadow">
                <h2 className="text-3xl font-semibold">Average Store Rating</h2>
                <p className="text-3xl"><StarRating rating = {averageRatings}/></p>
            </div>

            <div className="p-4 mb-6 rounded shadow">
                <h2 className="text-3xl font-semibold mb-6">Store Information</h2>
                {ownerStoreName.map((storeName, index) => (
                    <div className='ml-2' key={index}>
                        <p className='text-2xl'><strong> Store Name:</strong> {storeName.name}</p>
                        <p className='text-2xl'><strong>Store Address:</strong> {storeName.address}</p>
                        <p className='text-2xl'><strong>Store Email:</strong> {storeName.email}</p>
                    </div>
                ))}
            </div>

            <div className="p-4 rounded shadow">
                <h2 className="text-3xl font-semibold mb-4">Customer Ratings</h2>
                <table className="min-w-full table-auto border">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-2xl border">Customer</th>
                            <th className="px-4 py-2 text-2xl border">Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.length > 0 && ratings.map((rating, index) => (
                            <tr key={index}>
                                <td className="border text-xl font-bold px-4 py-2">{rating.user.name}</td>
                                <td className="border px-4 py-2"><StarRating rating={rating.rating} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreOwnerDashboard;
