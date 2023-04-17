import React, { useContext, useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import AuthContext from "../../common/context/AuthContext";
import { getEventById } from "../../common/api/event";
import { getImageURL } from "../../common/api/s3";
import { formatDate, formatTime } from "../../common/util/formatOutput";
import { EditEventModal } from "../components/EditEventModal";

const EventPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = currentUser.signInUserSession.idToken.jwtToken;
      try {
        const fetchedEvent = await getEventById(eventId, authToken);
        setEvent(fetchedEvent);

        if (fetchedEvent.image) {
          const url = await getImageURL(fetchedEvent.image);
          setImageURL(url);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser, eventId]);

  const handleEventUpdated = (updatedEvent) => {
    // copy event object and update the fields that are present in the updatedEvent

    const newEvent = { ...event };
    newEvent.name = updatedEvent.name || event.name;
    newEvent.description = updatedEvent.description || event.description;
    newEvent.dateTime = updatedEvent.dateTime || event.dateTime;
    newEvent.capacity = updatedEvent.capacity || event.capacity;
    newEvent.isPublic = updatedEvent.isPublic || event.isPublic;

    // if the image has changed, update the image URL
    if (updatedEvent.image && updatedEvent.image !== event.image) {
      getImageURL(updatedEvent.image).then((url) => setImageURL(url));
    }

    setIsEditing(false);
  };

  if (!event) {
    return (
      <div className="container mx-auto px-4 max-w-4xl pt-4 flex justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl pt-4">
      <div className="bg-white shadow-md rounded-md overflow-hidden pb-2">
        {imageURL && (
          <div
            className="relative w-full overflow-hidden"
            style={{ paddingTop: "56.25%" }}
          >
            <img
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={imageURL}
              alt={event.name}
            />
          </div>
        )}
        <div className="p-4">
          <h1 className="text-3xl font-semibold mt-4 mb-4">{event.name}</h1>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="text-gray-600 mb-4">
            <span>Date: {formatDate(event.dateTime)}</span>
            <br />
            <span>Time: {formatTime(event.dateTime)}</span>
          </div>
        </div>
        {currentUser.attributes.sub === event.uid && (
          <div className="flex justify-center">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-semibold text-sm py-1 px-3 mb-2 mt-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
      <EditEventModal
        isOpen={isEditing}
        event={event}
        onClose={() => setIsEditing(false)}
        onEventUpdated={handleEventUpdated}
      />
    </div>
  );
};

export default EventPage;
