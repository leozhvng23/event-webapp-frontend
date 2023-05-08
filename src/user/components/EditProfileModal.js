import React, { useState, useContext } from "react";
import Modal from "../../common/components/UIElements/Modal";
import AuthContext from "../../common/context/AuthContext";
import { updateUser } from "../../common/api/user";

export const EditProfileModal = ({ isOpen, onClose, userData, setUserData }) => {
  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState(userData.name);
  const [bio, setBio] = useState(userData.bio);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name) return "Name";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const missingField = validateForm();
    if (missingField) {
      alert(`Please fill in the ${missingField} field.`);
      return;
    }

    const updatedUserData = {
      name,
      bio,
    };

    let authToken = null;
    if (currentUser && currentUser.signInUserSession) {
      authToken = currentUser.signInUserSession.idToken.jwtToken;
    }

    try {
      console.log(currentUser.username);
      await updateUser(currentUser.username, authToken, updatedUserData);
      alert("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
    // update the user data in the state
    setUserData((prevState) => ({
      ...prevState,
      ...updatedUserData,
    }));
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      {loading ? (
        <div className="text-center font-semibold text-lg text-gray-600">
          Updating profile, please wait...
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Form elements for name, email, and bio */}
          {/* ... */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
              About me (optional)
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="bio"
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 mt-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
