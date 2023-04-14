import React, { useState } from "react";

import Modal from "../../common/components/UIElements/Modal";
import { combineDateAndTime } from "../../common/util/formatInput";
import { generateUUID } from "../../common/util/generateId";
import { uploadImageToS3 } from "../../common/api/s3";

export const NewEventModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [image, setImage] = useState(null);
  const [formModified, setFormModified] = useState(false);

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
        onClose();
      }
    } else {
      onClose();
    }
  };

  const validateForm = () => {
    if (!name) return "Name";
    if (!date) return "Date";
    if (!time) return "Time";
    if (!description) return "Description";
    if (!capacity) return "Capacity";
    if (isPublic === null) return "Is Public";
    if (!image) return "Image";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventId = generateUUID();

    const missingField = validateForm();
    if (missingField) {
      alert(`Please fill in the ${missingField} field.`);
      return;
    }

    if (image) {
      const folder = "events-images";
      const imagePath = await uploadImageToS3(image, eventId, folder);
      if (imagePath) {
        setImage(imagePath);
      } else {
        console.error("Image upload failed");
        return;
      }
    }

    const dateTime = combineDateAndTime(date, time);

    const eventData = {
      id: eventId,
      name,
      dateTime,
      description,
      capacity,
      isPublic,
      createdAt: new Date().toISOString(),
      image,
    };

    console.log("eventData:", eventData);

    // Submit the form data to the database and upload the image to S3
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Event">
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
          <label className="block text-gray-700 text-sm font-bold mb-2">Event Type</label>
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
    </Modal>
  );
};
