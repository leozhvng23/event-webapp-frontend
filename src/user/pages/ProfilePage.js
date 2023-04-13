import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../common/context/AuthContext";

const ProfilePage = () => {
  const { currentUser, isLoggedIn } = useContext(AuthContext);

  return (
    <div>
      <h2>Profile Page</h2>
      {isLoggedIn ? (
        <div>
          <h3>User Information</h3>
          <p>Name: {currentUser.attributes.name}</p>
          <p>Email: {currentUser.attributes.email}</p>
          <p>Username: {currentUser.username}</p>
          <p>Id: {currentUser.attributes.sub}</p>
          <p>Id Token: {currentUser.signInUserSession.idToken.jwtToken}</p>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default ProfilePage;
