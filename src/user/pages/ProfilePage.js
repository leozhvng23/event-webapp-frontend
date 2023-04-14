import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../common/context/AuthContext";
import { getUser } from "../../common/api/user";

const ProfilePage = () => {
  const { currentUser, isLoggedIn } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let authToken = null;
      if (currentUser && currentUser.signInUserSession) {
        authToken = currentUser.signInUserSession.idToken.jwtToken;
      }
      console.log("authToken:", authToken);
      try {
        const response = await getUser(currentUser.attributes.sub, authToken);
        setUserData(response);
        console.log("response:", response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [currentUser, isLoggedIn]);

  return (
    <div>
      <h2>Profile Page</h2>
      {isLoggedIn ? (
        loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h3>User Information</h3>
            {userData && (
              <>
                <p>Name: {userData.name}</p>
                <p>Email: {userData.email}</p>
                <p>Username: {userData.username}</p>
                <p>Id: {userData.id}</p>
                <p>Bio: {userData.bio}</p>
              </>
            )}
            <h4>ID Token:</h4>
            <pre>{currentUser.signInUserSession.idToken.jwtToken}</pre>
          </div>
        )
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default ProfilePage;
