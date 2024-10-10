import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Use navigate to programmatically redirect
    const navigate = useNavigate();

    const collectData = async (e) => {
        e.preventDefault();
        try {
            let result = await fetch('http://192.168.1.5:5000/login', {
                method: 'post',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            result = await result.json();

            // Check if login is successful and token is received
            if (result.message === 'Login successful' && result.token) {
                // Store the JWT token in localStorage
                localStorage.setItem('token', result.token);
                localStorage.setItem("user", JSON.stringify(result.user));

                // Navigate to home page after successful login
                navigate('/home');
            } else {
                // Handle errors (Invalid password or user not found)
                setError(result.message);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div>
            <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md px-6 py-8 space-y-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl dark:text-white">
                        Login
                    </h1>
                    {/* Show error message */}
                    {error && <p className="text-red-600 text-center">{error}</p>}
                    <form className="space-y-6" onSubmit={collectData}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-5 py-2.5 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            Login
                        </button>
                        <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400">
                            Don't have an account? <Link to="/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Signup Here</Link>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;
