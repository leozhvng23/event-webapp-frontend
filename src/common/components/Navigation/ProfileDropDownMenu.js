// components/NavBar/ProfileDropDownMenu.js
import React from "react";

export const ProfileDropDownMenu = ({
  isOpen,
  isLoggedIn,
  onLogin,
  onSignup,
  onProfile,
  onSignOut,
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="bg-white text-gray-700 mt-2 rounded shadow absolute left-1/2 transform -translate-x-1/2 w-min"
      style={{ zIndex: 1000 }}
    >
      {!isLoggedIn && (
        <>
          <button
            onClick={onLogin}
            className="block w-full text-left p-3 rounded whitespace-nowrap hover:bg-gray-200"
          >
            Log In
          </button>
          <button
            onClick={onSignup}
            className="block w-full text-left p-3 rounded whitespace-nowrap hover:bg-gray-200"
          >
            Sign Up
          </button>
        </>
      )}
      {isLoggedIn && (
        <>
          <button
            onClick={onProfile}
            className="block w-full text-left p-3 rounded-t whitespace-nowrap hover:bg-gray-200"
          >
            My Profile
          </button>
          <button
            onClick={onSignOut}
            className="block w-full text-left p-3 rounded-b whitespace-nowrap hover:bg-gray-200"
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
};
