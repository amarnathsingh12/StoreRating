import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
    const [signupInfo, setSignupInfo] = useState({ name: '', email: '', password: '', address: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        isLogin
            ? setLoginInfo(prev => ({ ...prev, [name]: value }))
            : setSignupInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleError = (msg) => alert(msg || "Something went wrong!");

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) return handleError("Email and password are required");

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInfo)
            });

            const result = await res.json();
            const { success, token, name, id, role, message } = result;

            if (success) {
                localStorage.setItem('token', token);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('loggedInUserId', id);
                localStorage.setItem('loginRole', role);

                if (role === 'Admin') navigate('/adminpage');
                else if (role === 'Store Owner') navigate('/storeOwner');
                else navigate('/storeList');
            } else {
                handleError(message);
            }
        } catch {
            handleError("Failed to login. Please try again later.");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) return handleError("Name, email and password are required");

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupInfo)
            });

            const result = await res.json();
            if (result.success) {
                alert("Registered successfully! Redirecting to login...");
                setIsLogin(true);
            }
        } catch {
            handleError("Registration failed. Please try again.");
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-white flex flex-col"
        >
                {/* Navbar */}
                <header className="flex justify-between items-center px-8 py-6 bg-white/10 backdrop-blur-md">
                    <h1 className="text-3xl font-bold text-white">StoreRatings</h1>
                    <div className="space-x-6 text-white text-lg">
                        <button onClick={() => setIsLogin(true)} className="hover:underline">Login</button>
                        <button onClick={() => setIsLogin(false)} className="hover:underline">Register</button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow flex flex-col md:flex-row justify-center items-center text-white px-4 py-12">
                    {/* Hero Section */}
                    <div className="max-w-xl text-center md:text-left mb-10 md:mb-0 md:mr-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Rate & Discover Local Stores</h2>
                        <p className="text-lg text-gray-100">
                            Share your experiences and explore top-rated stores in your area. Honest reviews help everyone shop smarter.
                        </p>
                    </div>

                    {/* Auth Form */}
                    <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            {isLogin ? "Please Login" : "Please Register"}
                        </h2>

                        <form onSubmit={isLogin ? handleLogin : handleSignup}>
                            {!isLogin && (
                                <div className="mb-3">
                                    <label className="block text-sm font-bold mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={signupInfo.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                                        placeholder="Your Name"
                                    />
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="block text-sm font-bold mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={isLogin ? loginInfo.email : signupInfo.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                                    placeholder="Email"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-bold mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={isLogin ? loginInfo.password : signupInfo.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                                    placeholder="Password"
                                />
                            </div>

                            {!isLogin && (
                                <div className="mb-3">
                                    <label className="block text-sm font-bold mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={signupInfo.address}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                                        placeholder="Your Address"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded mt-2"
                            >
                                {isLogin ? "Login" : "Register"}
                            </button>
                        </form>

                        <p className="text-sm mt-4 text-center">
                            {isLogin ? (
                                <>Don't have an account?{' '}
                                    <button onClick={() => setIsLogin(false)} className="text-blue-600 hover:underline">Register</button></>
                            ) : (
                                <>Already have an account?{' '}
                                    <button onClick={() => setIsLogin(true)} className="text-blue-600 hover:underline">Login</button></>
                            )}
                        </p>
                    </div>
                </main>

                {/* Footer */}
                <footer className="text-center text-white text-sm py-4 bg-black bg-opacity-40">
                    © {new Date().getFullYear()} StoreRatings. All rights reserved.
                </footer>
            {/* </div> */}
        </div>
    );
};

export default Home;
