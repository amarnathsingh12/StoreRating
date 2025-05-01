import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, UserPlus, LayoutDashboard, Users, Store } from "lucide-react";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [storeOwners, setStoreOwners] = useState([]);
    const [addUser, setAddUser] = useState(false);
    const [addStore, setAddStore] = useState(false);
    const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
    const [newUser, setNewUser] = useState({
        name: '', email: '', password: '', address: '', role: 'user'
    });
    const [newStore, setNewStore] = useState({
        name: '', email: '', address: '', ownerId: ''
    });
    const [filterType, setFilterType] = useState('name');
    const [toggleStoreButtonColour, setToggleStoreButtonColour] = useState(false)
    const [toggleUserButtonColour, setToggleUserButtonColour] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [currentPage, setCurrentPage] = useState('dashboard'); // New state for navigation

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchStores();
        fetchOwners();
    }, []);

    const fetchStats = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        setStats(data);
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        setUsers(data);
    };

    const fetchOwners = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch("http://localhost:5000/api/admin/store-owners", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setStoreOwners(data.owners);
            } else {
                alert("Failed to load store owners");
            }
        } catch (err) {
            console.error("Error fetching store owners", err);
        }
    };

    const fetchStores = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/stores', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        setStores(data);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role')
        navigate('/');
    };

    const handleNewUser = () => {
        setAddUser(true);
        setToggleUserButtonColour(true);
        setCurrentPage('dashboard');
    }

    const handleNewStore = () => {
        setAddStore(true);
        setToggleStoreButtonColour(true);
        setCurrentPage('dashboard');
    }

    const handleCancel = () => {
        setAddUser(false);
        setAddStore(false);
        setErrorMessage("");
        setToggleStoreButtonColour(false);
        setToggleUserButtonColour(false);
    }

    const handleAddUser = async (e) => {
        e.preventDefault();
        const { name, email, password } = newUser;
        if (!name || !email || !password) {
            setErrorMessage("Please fill all required fields")
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            const result = await res.json();
            const { success } = result;
            if (success) {
                setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
                fetchUsers();
                setAddUser(false);
                setErrorMessage("");
                setToggleUserButtonColour(false)
            }
        } catch {
            setErrorMessage("Registration failed. Please try again.");
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        const { name, email, address, ownerId } = newStore;
        if (!name || !email || !address || !ownerId) {
            setErrorMessage("Please fill all required fields including selecting an owner.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch("http://localhost:5000/api/admin/stores", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newStore)
            });

            const result = await res.json();
            const { success } = result;
            if (success) {
                setNewStore({ name: '', email: '', address: '', ownerId: '' });
                fetchStores();
                setAddStore(false);
                setErrorMessage("");
                setToggleStoreButtonColour(false);
            }
        } catch {
            setErrorMessage("Store Addition failed. Please try again.");
        }
    };

    const filteredUsers = users.filter(user =>
        user[filterType].toLowerCase().includes(filters[filterType].toLowerCase())
    );

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-indigo-400 via-blue-400 to-white">
            {/* Left Sidebar */}
            <div className="w-1/5 bg-gray-200 text-black p-6">
                <h2 className="text-2xl font-semibold mt-10 mb-6">Admin Panel</h2>
                <ul>
                    <li
                        className="mb-4 flex flex-row items-center gap-2 text-xl cursor-pointer"
                        onClick={() => setCurrentPage('dashboard')}
                    >
                        <LayoutDashboard />
                        Dashboard
                    </li>
                    <li className="mb-4 flex flex-row items-center gap-2 text-xl cursor-pointer" onClick={() => setCurrentPage('users')}><Users />Users</li>
                    <li className="mb-4 flex flex-row items-center gap-2 text-xl cursor-pointer" onClick={() => setCurrentPage('stores')}><Store />Stores</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <div className="flex justify-between my-4 items-center mb-6">
                    <h1 className="text-5xl font-bold">Admin Dashboard</h1>
                    <div className="flex gap-2">
                        <button onClick={handleNewStore} className={`${toggleStoreButtonColour ? "bg-blue-500 text-white" : "bg-white"} border border-black text-black mr-2 cursor-pointer px-4 py-2 rounded flex items-center`}>
                            <Plus className="mr-2 h-5 w-5" /> Add Store
                        </button>
                        <button onClick={handleNewUser} className={`${toggleUserButtonColour ? "bg-blue-500 text-white" : "bg-white"} border border-black text-black mr-2 cursor-pointer px-4 py-2 rounded flex items-center`}>
                            <UserPlus className="mr-2 h-5 w-5" /> Add User
                        </button>
                        <button onClick={handleLogout} className="bg-red-500 text-white cursor-pointer px-4 py-2 rounded flex items-center gap-2">
                            <LogOut /> Logout
                        </button>
                    </div>
                </div>

                {/* Conditionally render content based on currentPage */}
                {currentPage === 'dashboard' && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="shadow p-4 rounded text-center">
                            <p className="text-3xl font-bold">Total Users</p>
                            <p className="text-3xl font-bold mt-2">{stats.users}</p>
                        </div>
                        <div className="shadow p-4 rounded text-center">
                            <p className="text-3xl font-bold">Total Stores</p>
                            <p className="text-3xl font-bold mt-2">{stats.stores}</p>
                        </div>
                        <div className="shadow p-4 rounded text-center">
                            <p className="text-3xl font-bold">Total Ratings</p>
                            <p className="text-3xl font-bold mt-2">{stats.ratings}</p>
                        </div>
                    </div>
                )}

                {/* Add User Form */}
                {addUser && (
                    <div className='flex justify-center'>
                        <div className="bg-blue-100 w-2/7 shadow p-6 rounded mt-8">
                            <h2 className="text-3xl font-semibold text-center mb-4">New User</h2>
                            <form onSubmit={handleAddUser} className="flex flex-col space-y-4">
                                <input className="border p-2 rounded" type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                                <input className="border p-2 rounded" type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                                <input className="border p-2 rounded" type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                                <textarea className="border p-3 rounded w-full h-24 resize-none" placeholder="Address" value={newUser.address} onChange={e => setNewUser({ ...newUser, address: e.target.value })} />
                                <select className="border p-2 rounded" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                    <option value="user">User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <div className="flex justify-end">
                                    <button className="bg-blue-600 text-white w-1/4 mr-2 p-1 cursor-pointer rounded">Add User</button>
                                    <button onClick={handleCancel} className="bg-red-600 text-white w-1/4 cursor-pointer rounded">Cancel</button>
                                </div>
                                {errorMessage && (<div className="text-red-500">{errorMessage}</div>)}
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Store Form */}
                {addStore && (
                    <div className='flex justify-center'>
                        <div className="bg-blue-100 w-2/7 shadow p-6 rounded mt-8">
                            <h2 className="text-3xl font-semibold text-center mb-4">New Store</h2>
                            <form onSubmit={handleAddStore} className="flex flex-col space-y-4">
                                <input className="border p-2 rounded" type="text" placeholder="Store Name" value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} />
                                <input className="border p-2 rounded" type="email" placeholder="Email" value={newStore.email} onChange={e => setNewStore({ ...newStore, email: e.target.value })} />
                                <textarea
                                    className="border p-3 rounded w-full h-24 resize-none"
                                    placeholder="Address"
                                    value={newStore.address}
                                    onChange={e => setNewStore({ ...newStore, address: e.target.value })}
                                />

                                <select className="border p-2 rounded" value={newStore.ownerId} onChange={e => setNewStore({ ...newStore, ownerId: e.target.value })}>
                                    <option value="">Select Owner</option>
                                    {storeOwners.map(owner => (
                                        <option key={owner._id} value={owner._id}>
                                            {owner.name} ({owner.email})
                                        </option>
                                    ))}
                                </select>
                                <div className="flex justify-end">
                                    <button className="bg-blue-600 text-white w-1/4 mr-2 p-0.5 cursor-pointer rounded">Add Store</button>
                                    <button onClick={handleCancel} className="bg-red-600 text-white w-1/4 cursor-pointer rounded">Cancel</button>
                                </div>
                                {errorMessage && (<div className="text-red-500">{errorMessage}</div>)}
                            </form>
                        </div>
                    </div>
                )}

                {/* User List */}
                {currentPage === 'users' && (
                    <>
                        <div className="flex items-center gap-4 my-4 mx-4">
                            <select
                                className="border text-xl p-2 rounded w-1/3"
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                            >
                                <option value="name">Name</option>
                                <option value="email">Email</option>
                                <option value="address">Address</option>
                                <option value="role">Role</option>
                            </select>
                            <input
                                className="border p-3 rounded w-full"
                                placeholder={`Filter by ${filterType}`}
                                onChange={e =>
                                    setFilters({ ...filters, [filterType]: e.target.value })
                                }
                            />
                        </div>
                        <div className="p-6 bg-white shadow-lg rounded-lg mt-6 mx-4">
                            <h2 className="text-4xl font-bold text-center text-blue-700 mb-6">
                                👥 User List
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
                                    <thead className="bg-blue-100 text-blue-800 text-xl font-semibold">
                                        <tr>
                                            <th className="px-6 py-3 border-b">Name</th>
                                            <th className="px-6 py-3 border-b">Email</th>
                                            <th className="px-6 py-3 border-b">Address</th>
                                            <th className="px-6 py-3 border-b">Role</th>
                                            <th className="px-6 py-3 border-b">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, index) => (
                                            <tr
                                                key={index}
                                                className={`text-center text-lg hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                    }`}
                                            >
                                                <td className="px-6 py-3 border-b">{user.name}</td>
                                                <td className="px-6 py-3 border-b">{user.email}</td>
                                                <td className="px-6 py-3 border-b">{user.address}</td>
                                                <td className={`px-6 py-3 border-b capitalize ${user.role.toLowerCase() === 'admin' ? 'text-red-600 font-semibold' : ''}`}>
                                                    {user.role}
                                                </td>
                                                <td className="px-6 py-3 border-b">{user.rating}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}


                {/* Store List */}
                {currentPage === 'stores' && (
                    <>
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
                        <div className="p-6 bg-white shadow-lg rounded-lg mt-6 mx-4">
                            <h2 className="text-4xl font-bold text-center text-blue-700 mb-6">
                                🏪 Store List
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
                                    <thead className="bg-blue-100 text-blue-800 text-xl font-semibold">
                                        <tr>
                                            <th className="px-6 py-3 border-b">Name</th>
                                            <th className="px-6 py-3 border-b">Email</th>
                                            <th className="px-6 py-3 border-b">Address</th>
                                            <th className="px-6 py-3 border-b">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stores.map((store, index) => (
                                            <tr
                                                key={index}
                                                className={`text-center text-lg hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                    }`}
                                            >
                                                <td className="px-6 py-3 border-b">{store.name}</td>
                                                <td className="px-6 py-3 border-b">{store.email}</td>
                                                <td className="px-6 py-3 border-b">{store.address}</td>
                                                <td className="px-6 py-3 border-b">{store.rating}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
