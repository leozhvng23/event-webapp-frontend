import React, { useContext, useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faMapMarkerAlt,
  faUsers,
  faLock,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../common/context/AuthContext";
import { getEventById } from "../../common/api/event";
import { getImageURL } from "../../common/api/s3";
import { formatDate, formatTime } from "../../common/util/formatOutput";
import { EditEventModal } from "../components/EditEventModal";
import Tile from "../../common/components/UIElements/Tile";
import { createMap, drawPoints } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";

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

  useEffect(() => {
    const initializeMap = async () => {
      const map = await createMap({
        container: "map",
        center: event.location.geometry.point,
        zoom: 13,
      });
      map.on("load", () => {
        drawPoints(
          "Event Location",
          [
            {
              coordinates: event.location.geometry.point,
              title: event.name,
              address: event.location.label,
            },
          ],
          map,
          {
            showCluster: true,
            unclusteredOptions: {
              showMarkerPopup: true,
            },
            clusterOptions: {
              showCount: true,
            },
          }
        );
      });
    };
    initializeMap();
  }, [event]);

  const handleEventUpdated = (updatedEvent) => {
    // copy event object and update the fields that are present in the updatedEvent

    const newEvent = { ...event };
    newEvent.name = updatedEvent.name || event.name;
    newEvent.description = updatedEvent.description || event.description;
    newEvent.detail = updatedEvent.detail || event.detail;
    newEvent.dateTime = updatedEvent.dateTime || event.dateTime;
    newEvent.capacity = updatedEvent.capacity || event.capacity;
    newEvent.isPublic = updatedEvent.isPublic || event.isPublic;
    newEvent.location = updatedEvent.location || event.location;

    // if the image has changed, update the image URL
    if (updatedEvent.image && updatedEvent.image !== event.image) {
      getImageURL(updatedEvent.image).then((url) => setImageURL(url));
    }

    setEvent(newEvent);
    setIsEditing(false);
  };

  const getLocationLabel = (location) => {
    if (location.neighborhood && location.municipality) {
      return `${location.neighborhood}, ${location.municipality}`;
    } else if (location.neighborhood) {
      return location.neighborhood;
    } else if (location.municipality) {
      return location.municipality;
    } else if (location.region) {
      return location.region;
    } else if (location.country) {
      return location.country;
    } else {
      return location.label;
    }
  };

  const createGoogleMapsDirectionUrl = (latitude, longitude) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  };

  if (!event) {
    return (
      <div className="container mx-auto px-4 max-w-4xl pt-4 flex justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl pt-4 pb-6">
      <div className="flex flex-col mb-6 md:flex-row space-y-6 md:space-y-0">
        <Tile className="w-full max-h-96 md:w-[61.8%] md:order-2">
          {imageURL && (
            <img className="w-full h-full object-cover" src={imageURL} alt={event.name} />
          )}
        </Tile>
        <Tile className="w-full md:w-[38.2%] max-h-fit md:order-1 md:mr-6">
          <div className="p-4">
            <div className="flex items-center w-full h-14 mt-4 mb-4">
              <span
                className={`font-semibold w-full ${
                  event.name.length > 30 ? "text-xl" : "text-3xl"
                }`}
              >
                {event.name}
              </span>
            </div>
            <p className="text-gray-600 font-semibold mb-4">{event.description}</p>
            <div className="w-full items-start mb-4">
              <div className="w-full">
                <FontAwesomeIcon icon={faCalendar} className="text-gray-600 mr-2 w-5" />
                <strong className="text-gray-600">Date: </strong>
                <span className="text-gray-600">{formatDate(event.dateTime)}</span>
              </div>
              <div className="w-full">
                <FontAwesomeIcon icon={faClock} className="text-gray-600 mr-2 w-5" />
                <strong className="text-gray-600">Time: </strong>
                <span className="text-gray-600">{formatTime(event.dateTime)}</span>
              </div>
              <div className="w-full">
                <FontAwesomeIcon icon={faUsers} className="text-gray-600 mr-2 w-5" />
                <strong className="text-gray-600">Capacity: </strong>
                <span className="text-gray-600">{event.capacity}</span>
              </div>
              {/* <div className="w-full line-clamp-1">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-gray-600 mr-2 w-5"
                />
                <strong className="text-gray-600">Location: </strong>
                <span className="text-gray-600">{getLocationLabel(event.location)}</span>
              </div> */}
              <div className="w-full">
                <FontAwesomeIcon
                  icon={event.isPublic ? faGlobe : faLock}
                  className="text-gray-600 mr-2 w-5"
                />
                <strong className="text-gray-600">Visibility: </strong>
                <span className="text-gray-600">
                  {event.isPublic ? "Public" : "Private"}
                </span>
              </div>
            </div>
          </div>
        </Tile>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
      {event.detail.length > 0 && (
        <Tile className="w-full h-fit mb-6">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-600">{event.detail}</p>
          </div>
        </Tile>
      )}
      <Tile className="w-full h-fit">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <p className="text-gray-600 mb-4">{event.location.label}</p>
          <div id="map" className="w-full h-60"></div>
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-1 px-3 mb-2 mt-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                const [longitude, latitude] = event.location.geometry.point;
                const url = createGoogleMapsDirectionUrl(latitude, longitude);
                window.open(url, "_blank");
              }}
            >
              Get Directions
            </button>
          </div>
        </div>
      </Tile>
      {currentUser.attributes.sub === event.uid && (
        <div className="flex justify-center mt-4 mb-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-white font-semibold text-sm py-1 px-3 mb-2 mt-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            Edit Event
          </button>
        </div>
      )}
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
