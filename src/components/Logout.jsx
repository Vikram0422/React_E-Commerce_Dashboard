import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  // Function to handle sign out
  const handleSignOut = () => {
    // Clear user data and token from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Navigate to login page after logout
    navigate('/login');
  };

  // Function to handle cancel (stay on the current page)
  const handleCancel = () => {
    navigate('/home'); // Or any other route you want to navigate back to
  };

  return (
    <div className="min-h-[100vh] bg-gray-500 flex items-center justify-center px-4">
      <div className="p-4 sm:p-10 bg-gray-50 rounded-md w-full max-w-sm md:max-w-md text-center overflow-y-auto">
        <span className="mb-4 inline-flex justify-center items-center w-16 h-16 rounded-full border-4 border-yellow-50 bg-yellow-100 text-yellow-500">
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
          </svg>
        </span>

        <h3 className="mb-2 text-2xl font-bold text-gray-800">Logout</h3>
        <p className="text-gray-500">Are you sure you would like to log out of your account?</p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleSignOut}
            className="py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm w-full sm:w-auto"
          >
            Logout
          </button>
          <button
            onClick={handleCancel}
            className="py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
