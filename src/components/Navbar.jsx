import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faPlus, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import '../App.css'

const Navbar = () => {
  // Retrieve the user's name from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="w-full">
      <img
        className="w-12 h-12 float-left rounded-full mt-1 ml-2"
        src="https://static.vecteezy.com/system/resources/thumbnails/011/401/535/small_2x/online-shopping-trolley-click-and-collect-order-logo-design-template-vector.jpg"
        alt="logo"
      />
      <ul className="p-2.5 bg-blue-300 flex flex-wrap justify-between items-center">
        <div className="flex space-x-4 flex-wrap">
          <li className="inline-block p-2 text-white">
            <Link to="/home" className="flex items-center">
              <FontAwesomeIcon icon={faBox} className="mr-1" />
              Products
            </Link>
          </li>
          <li className="inline-block p-2 text-white">
            <Link to="/add-product" className="flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-1" />
              Add products
            </Link>
          </li>
          <li className="inline-block p-2 text-white">
            <Link to="/logout" className="flex items-center">
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
              Logout
            </Link>
          </li>
        </div>
        <div className="text-white flex items-center mt-1">
          <FontAwesomeIcon icon={faUser} className="mr-1" />
          {user ? `Welcome, ${user.name}` : 'Welcome, Guest'}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
