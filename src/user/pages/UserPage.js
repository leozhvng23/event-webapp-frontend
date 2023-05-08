import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../common/context/AuthContext";
import { useParams } from "react-router-dom";
import { getUser } from "../../common/api/user";
import { EditProfileModal } from "../components/EditProfileModal";
import Loading from "../../common/components/UIElements/Loading";

const UserPage = () => {
  const { currentUser, isLoggedIn } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = useParams().userId || currentUser.attributes.sub;
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let authToken = null;
      if (currentUser && currentUser.signInUserSession) {
        authToken = currentUser.signInUserSession.idToken.jwtToken;
      }
      console.log("authToken:", authToken);
      try {
        const response = await getUser(userId, authToken);
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
  }, [currentUser, isLoggedIn, userId]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {isLoggedIn ? (
        loading ? (
          <Loading />
        ) : (
          <>
            <div className="bg-gray-50 shadow-md rounded p-6">
              <h3 className="text-xl font-semibold mb-2">User Information</h3>
              {userData && (
                <>
                  <p className="mb-1">
                    <strong>Name:</strong> {userData.name}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {userData.email}
                  </p>
                  <p className="mb-3">
                    <strong>About me:</strong> {userData.bio}
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-center mt-4">
              {userId === currentUser.attributes.sub && (
                <button
                  className="bg-gray-400 font-semibold hover:bg-gray-600 text-white px-4 py-1 rounded"
                  onClick={() => setIsEditProfileModalOpen(true)}
                >
                  Edit
                </button>
              )}
            </div>
          </>
        )
      ) : (
        <p>Please log in to view your profile.</p>
      )}

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        userData={{
          name: userData ? userData.name : "",
          bio: userData ? userData.bio : "",
        }}
        setUserData={setUserData}
      />
    </div>
  );
};

export default UserPage;
