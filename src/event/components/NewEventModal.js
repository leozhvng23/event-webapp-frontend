import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../common/components/UIElements/Modal";
import { combineDateAndTime } from "../../common/util/formatInput";
import { generateUUID } from "../../common/util/generateId";
import { uploadImageToS3 } from "../../common/api/s3";
import { createEvent } from "../../common/api/event";
import LocationSearchBar from "../../common/components/Map/LocationSearchBar";
import AuthContext from "../../common/context/AuthContext";

export const NewEventModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationSearchText, setLocationSearchText] = useState("");
  const [image, setImage] = useState(null);
  const [formModified, setFormModified] = useState(false);
  const [loading, setLoading] = useState(false);
  const descriptionMaxLength = 110;
  const nameMaxLength = 50;
  const [descriptionRemainingChars, setDescriptionRemainingChars] =
    useState(descriptionMaxLength);
  const [nameRemainingChars, setNameRemainingChars] = useState(nameMaxLength);

  const resetInputFields = () => {
    setName("");
    setDate("");
    setTime("");
    setDescription("");
    setDetail("");
    setCapacity("");
    setIsPublic(true);
    setLocation(null);
    setImage(null);
    setLocationSearchText("");
    setDescriptionRemainingChars(descriptionMaxLength);
    setNameRemainingChars(nameMaxLength);
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
    if (isPublic === null) return "Event Type";
    if (!location) return "Location";
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
      detail,
      capacity: parseInt(capacity),
      isPublic,
      createdAt: new Date().toISOString(),
      location,
      image: imagePath,
    };

    console.log("eventData:", eventData);

    // Submit the form data to the database
    let authToken = null;
    if (currentUser && currentUser.signInUserSession) {
      authToken = currentUser.signInUserSession.idToken.jwtToken;
    }

    try {
      const result = await createEvent(eventData, authToken);
      alert("Event created successfully!");
      // navigate to the event page
      resetInputFields();
      onClose();
      if (result) {
        navigate(`/event/${eventId}`);
      }
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
              Name{" "}
              <span
                className={nameRemainingChars === 0 ? "text-red-600" : "text-gray-500"}
              >
                ({nameRemainingChars} / {nameMaxLength})
              </span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                if (e.target.value.length > nameMaxLength) return;
                setName(e.target.value);
                setNameRemainingChars(nameMaxLength - e.target.value.length);
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
              Description{" "}
              <span
                className={
                  descriptionRemainingChars === 0 ? "text-red-600" : "text-gray-500"
                }
              >
                ({descriptionRemainingChars}/{descriptionMaxLength})
              </span>
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= descriptionMaxLength) {
                  setDescription(e.target.value);
                  setDescriptionRemainingChars(
                    descriptionMaxLength - e.target.value.length
                  );
                  handleInputChange();
                }
              }}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="detail"
            >
              Detail <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="detail"
              value={detail}
              onChange={(e) => {
                setDetail(e.target.value);
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
          <LocationSearchBar
            setLocation={setLocation}
            searchText={locationSearchText}
            setSearchText={setLocationSearchText}
            handleInputChange={handleInputChange}
          />
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
