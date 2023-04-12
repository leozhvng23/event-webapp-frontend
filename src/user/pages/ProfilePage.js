import React, { useState, useContext, useEffect } from "react";
import UserContext from "../../common/context/UserContext";
import AuthContext from "../../common/context/AuthContext";

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div>
      <h2>Profile Page</h2>
      {isLoggedIn ? (
        <div>
          <h3>User Information</h3>
          <p>Name: {user.attributes.name}</p>
          <p>Email: {user.attributes.email}</p>
          <p>Username: {user.username}</p>
          <p>Id: {user.attributes.sub}</p>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default ProfilePage;
