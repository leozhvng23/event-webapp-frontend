import React, { useState, useContext, useEffect } from "react";

import Modal from "../../common/components/UIElements/Modal";
import { combineDateAndTime } from "../../common/util/formatInput";
import { generateUUID } from "../../common/util/generateId";
import { uploadImageToS3 } from "../../common/api/s3";
import { createEvent } from "../../common/api/event";
import AuthContext from "../../common/context/AuthContext";
import { updateAuthToken } from "../../common/api/auth";

export const NewEventModal = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [image, setImage] = useState(null);
  const [formModified, setFormModified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateCurrentUserToken = async () => {
      if (isOpen) {
        const updatedToken = await updateAuthToken();
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            signInUserSession: { idToken: { jwtToken: updatedToken } },
          });
        }
      }
    };

    updateCurrentUserToken();
  }, [isOpen, currentUser, setCurrentUser]);

  const resetInputFields = () => {
    setName("");
    setDate("");
    setTime("");
    setDescription("");
    setCapacity("");
    setIsPublic(true);
    setImage(null);
  };

  const handleInputChange = () => {
    setFormModified(true);
  };

  const handleClose = () => {
    if (formModified) {
      if (
        window.confirm(
          "You have unsaved changes in the form. Are you sure you want to discard them?"
        )
      ) {
        setFormModified(false);
        resetInputFields();
        onClose();
      }
    } else {
      onClose();
    }
  };

  const isDateTimeInFuture = (date, time) => {
    const dateTime = combineDateAndTime(date, time);
    const eventDateTime = new Date(dateTime);
    const now = new Date();
    return eventDateTime > now;
  };

  const validateForm = () => {
    if (!name) return "Name";
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Date (format: YYYY-MM-DD)";
    if (!time || !/^\d{2}:\d{2}$/.test(time)) return "Time (format: HH:mm)";
    if (!isDateTimeInFuture(date, time)) return "Date and Time (must be in the future)";
    if (!description) return "Description";
    if (!capacity || isNaN(capacity) || parseInt(capacity) <= 0)
      return "Capacity (positive integer)";
    if (isPublic === null) return "Is Public";
    if (!image) return "Image";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    const eventId = generateUUID();

    const missingField = validateForm();
    if (missingField) {
      alert(`Please fill in the ${missingField} field.`);
      return;
    }

    setLoading(true);
    let imagePath = "";
    if (image) {
      const folder = "events-images";
      const response = await uploadImageToS3(image, eventId, folder);
      if (response) {
        imagePath = response;
      } else {
        console.error("Image upload failed");
        return;
      }
    }

    const dateTime = combineDateAndTime(date, time);

    const eventData = {
      id: eventId,
      uid: currentUser.attributes.sub,
      name,
      dateTime,
      description,
      capacity: parseInt(capacity),
      isPublic,
      createdAt: new Date().toISOString(),
      image: imagePath,
    };

    console.log("eventData:", eventData);

    // Submit the form data to the database
    let authToken = null;
    if (currentUser && currentUser.signInUserSession) {
      authToken = currentUser.signInUserSession.idToken.jwtToken;
    }

    try {
      await createEvent(eventData, authToken);
      alert("Event created successfully!");
      resetInputFields();
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Event">
      {loading ? (
        <div className="text-center font-semibold text-lg text-gray-600">
          Creating event, please wait...
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleInputChange();
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                handleInputChange();
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
              Time
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="time"
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                handleInputChange();
              }}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                handleInputChange();
              }}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="capacity"
            >
              Capacity
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => {
                setCapacity(e.target.value);
                handleInputChange();
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Event Type
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="isPublic"
                  value="true"
                  checked={isPublic}
                  onChange={() => {
                    setIsPublic(true);
                    handleInputChange();
                  }}
                />
                <span className="ml-2">Public</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  className="form-radio"
                  name="isPublic"
                  value="false"
                  checked={!isPublic}
                  onChange={() => {
                    setIsPublic(false);
                    handleInputChange();
                  }}
                />
                <span className="ml-2">Private</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                handleInputChange();
              }}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 mt-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
