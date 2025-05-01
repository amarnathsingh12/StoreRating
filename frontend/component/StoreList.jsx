import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoreCard from './StoreCard';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [filterType, setFilterType] = useState('name');
  const [filters, setFilters] = useState({ name: '', address: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchStores = async () => {
    const res = await axios.get('http://localhost:5000/api/stores', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStores(res.data);
    console.log(res.data)
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role')
    navigate('/');
  };

  const handlePasswordChange = () => {
    navigate('/passwordChange', { state: { from: 'storeList' } });
  }

  useEffect(() => {
    fetchStores();
  }, []);

  const filtered = stores.filter(store =>
    store[filterType].toLowerCase().includes(filters[filterType].toLowerCase()) &&
    store[filterType].toLowerCase().includes(filters[filterType].toLowerCase())
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-blue-400 to-white flex flex-col">
      <div className="flex my-4 mx-4 justify-between mb-6 items-center">
        <h1 className="text-5xl font-bold">Stores</h1>
        <div className='flex gap-2'>
          <button onClick={handleLogout} className=" bg-red-500 text-white cursor-pointer px-4 py-2 rounded flex items-center gap-2"><LogOut /> Logout</button>
          <button onClick={handlePasswordChange} className="px-4 cursor-pointer mx-2 py-2 bg-red-500 text-white rounded">Password Change</button>
        </div>
      </div>  

      <div className="flex items-center gap-4 my-4 mx-4">
        <select
          className="border text-xl p-2 rounded w-1/3"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="address">Address</option>
        </select>
        <input
          className="border p-3 rounded w-full"
          placeholder={`Filter by ${filterType}`}
          onChange={e =>
            setFilters({ ...filters, [filterType]: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(store => (
          <StoreCard key={store._id} store={store} refresh={fetchStores} />
        ))}
      </div>
    </div>
  );
};

export default StoreList;
