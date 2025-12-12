

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
// optional: npm i jwt-decode
import {jwtDecode} from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const { credit, loadCreditsData } = useContext(AppContext);

  // --- Auth state from localStorage token ---
  const token = useMemo(() => localStorage.getItem('token'), []);
  const [userInfo, setUserInfo] = useState(null);
  const isSignedIn = !!token;

  useEffect(() => {
    if (isSignedIn) {
      try {
        // Expecting token payload to include name/email (depends on your backend)
        const payload = jwtDecode(token); // { name, fullName, email, ... }
        setUserInfo(payload);
      } catch {
        // bad/expired token → log out
        localStorage.removeItem('token');
        navigate('/login');
      }
      loadCreditsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const displayName =
    userInfo?.fullName || userInfo?.name || userInfo?.email || 'User';

  return (
    <div className="flex items-center justify-between mx-4 py-3 lg:mx-44">
      <Link to="/">
        <img className="w-32 sm:w-44" src={assets.logo} alt="logo" />
      </Link>

      {isSignedIn ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/buy')}
            className="flex items-center gap-2 bg-blue-100 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-700"
          >
            <img className="w-5" src={assets.credit_icon} alt="credits" />
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              Credits : {credit}
            </p>
          </button>

          <p className="text-gray-600 max-sm:hidden">Hi, {displayName}</p>

          {/* Simple logout button instead of <UserButton /> */}
          <button
            onClick={logout}
            className="bg-zinc-800 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="bg-zinc-800 text-white flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full"
        >
          Get started <img className="w-3 sm:w-4" src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
