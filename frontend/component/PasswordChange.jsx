import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/auth/password', passwords, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('✅ Password changed successfully');

      // Redirect back to the previous page after success
      const from = location.state?.from;
      if (from === 'storeList') {
        navigate('/storeList');
      } else if (from === 'storeowner') {
        navigate('/storeOwner');
      } else {
        navigate('/'); // fallback
      }
    } catch (err) {
      alert('❌ Failed to change password');
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-500 via-sky-400 to-white flex items-center justify-center">
      <form
        onSubmit={handleChange}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">🔒 Change Password</h2>

        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          type="password"
          placeholder="Current Password"
          onChange={e =>
            setPasswords({ ...passwords, currentPassword: e.target.value })
          }
          required
        />

        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          type="password"
          placeholder="New Password"
          onChange={e =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition duration-200"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
