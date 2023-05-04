import React, { useState, useEffect, useContext } from "react";
import Modal from "../../common/components/UIElements/Modal";
import {
  combineDateAndTime,
  reformatDate,
  reformatTime,
} from "../../common/util/formatInput";
import AuthContext from "../../common/context/AuthContext";
import { uploadImageToS3, deleteImageFromS3 } from "../../common/api/s3";
import { updateEvent } from "../../common/api/event";
import LocationSearchBar from "../../common/components/Map/LocationSearchBar";

export const EditEventModal = ({ isOpen, event, onClose, onEventUpdated }) => {
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
  const [loading, setLoading] = useState(false);
  const descriptionMaxLength = 110;
  const nameMaxLength = 50;
  const [descriptionRemainingChars, setDescriptionRemainingChars] =
    useState(descriptionMaxLength);
  const [nameRemainingChars, setNameRemainingChars] = useState(nameMaxLength);

  const [originalDate, originalTime] = [
    reformatDate(event.dateTime),
    reformatTime(event.dateTime),
  ];

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDate(originalDate);
      setTime(originalTime);
      setDescription(event.description);
      setDetail(event.detail);
      setCapacity(event.capacity);
      setIsPublic(event.isPublic);
      setLocation(event.location);
      setLocationSearchText(event.location.label);
      setDescriptionRemainingChars(descriptionMaxLength - event.description.length);
      setNameRemainingChars(nameMaxLength - event.name.length);
    }
  }, [event, originalDate, originalTime]);

  const resetInputFields = () => {
    setName(event.name);
    setDate(originalDate);
    setTime(originalTime);
    setDescription(event.description);
    setDetail(event.detail);
    setCapacity(event.capacity);
    setIsPublic(event.isPublic);
    setLocation(event.location);
    setLocationSearchText(event.location.label);
    setDescriptionRemainingChars(descriptionMaxLength - event.description.length);
    setNameRemainingChars(nameMaxLength - event.name.length);
  };

  // check if any values have changed
  const isFormModified = () => {
    return (
      name !== event.name ||
      date !== originalDate ||
      time !== originalTime ||
      description !== event.description ||
      detail !== event.detail ||
      capacity !== event.capacity ||
      isPublic !== event.isPublic ||
      image !== null ||
      locationSearchText !== event.location.label
    );
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
    if (!location || locationSearchText !== location.label) return "Location";
    return null;
  };

  const handleClose = () => {
    const formModified = isFormModified();
    if (formModified) {
      if (
        window.confirm(
          "You have unsaved changes in the form. Are you sure you want to discard them?"
        )
      ) {
        resetInputFields();
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const invalidField = validateForm();
    if (invalidField) {
      alert(`Invalid ${invalidField}`);
      setLoading(false);
      return;
    }

    let imagePath = "";
    if (image) {
      // delete old image from S3
      const key = event.image;
      const result = await deleteImageFromS3(key);
      if (!result) {
        alert("Error deleting old image. Please try again later.");
        return;
      }

      // upload new image to S3
      const folder = "events-images";
      const response = await uploadImageToS3(image, event.id, folder);
      if (response) {
        imagePath = response;
      } else {
        alert("Error uploading image. Please try again later.");
        return;
      }
    }

    const dateTime = combineDateAndTime(date, time);

    const updatedEvent = {
      createdAt: new Date().toISOString(),
    };

    if (name !== event.name) updatedEvent.name = name;
    if (dateTime !== event.dateTime) updatedEvent.dateTime = dateTime;
    if (description !== event.description) updatedEvent.description = description;
    if (detail !== event.detail) updatedEvent.detail = detail;
    // turn capacity into integer

    if (capacity !== event.capacity) updatedEvent.capacity = parseInt(capacity);
    if (isPublic !== event.isPublic) updatedEvent.isPublic = isPublic;
    if (location.label !== event.location.label) updatedEvent.location = location;
    if (image !== null) updatedEvent.image = imagePath;

    console.log("Updated Event Data:", updatedEvent);

    let authToken = null;
    let userId = null;
    if (currentUser && currentUser.signInUserSession) {
      authToken = currentUser.signInUserSession.idToken.jwtToken;
      userId = currentUser.attributes.sub;
    }
    try {
      await updateEvent(userId, event.id, updatedEvent, authToken);
      alert("Event updated successfully");
      onEventUpdated(updatedEvent);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error updating event. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Event">
      {loading ? (
        <div className="text-center font-semibold text-lg text-gray-600">
          Updating event, please wait...
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
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
                }}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="date"
              >
                Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="time"
              >
                Time
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="time"
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
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
                    }}
                  />
                  <span className="ml-2">Private</span>
                </label>
              </div>
            </div>
            <LocationSearchBar
              location={location}
              setLocation={setLocation}
              searchText={locationSearchText}
              setSearchText={setLocationSearchText}
              editMode={true}
            />
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="image"
              >
                Upload New Image
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
            </div>
          </form>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 mt-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
