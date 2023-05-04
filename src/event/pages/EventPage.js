import React, { useContext, useState, useEffect } from "react";

import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faUsers,
  faLock,
  faGlobe,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../common/context/AuthContext";
import { getEventById } from "../../common/api/event";
import { getImageURL } from "../../common/api/s3";
import { formatDate, formatTime } from "../../common/util/formatOutput";
import { EditEventModal } from "../components/EditEventModal";
import Tile from "../../common/components/UIElements/Tile";
import { createMap, drawPoints } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import Loading from "../../common/components/UIElements/Loading";
import InvitedUsers from "../components/InvitedUsers";
import { createInvitation } from "../../common/api/invitation";

// import dummy users data json
import usersData from "../../data/dummyInvitedUsers.json";

const EventPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = currentUser.signInUserSession.idToken.jwtToken;
      try {
        const fetchedEvent = await getEventById(eventId, authToken);
        setEvent(fetchedEvent);
        setPageLoading(false);
        if (fetchedEvent.image) {
          const url = await getImageURL(fetchedEvent.image);
          setImageURL(url);
          setImageLoading(false);
        }
        await initializeMap(fetchedEvent);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    const initializeMap = async (eventData) => {
      const map = await createMap({
        container: "map",
        center: eventData.location.geometry.point,
        zoom: 13,
      });
      map.on("load", () => {
        drawPoints(
          "Event Location",
          [
            {
              coordinates: eventData.location.geometry.point,
              title: eventData.name,
              address: eventData.location.label,
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

    if (currentUser) {
      fetchData();
    }
  }, [currentUser, eventId]);

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

  // const getLocationLabel = (location) => {
  //   if (location.neighborhood && location.municipality) {
  //     return `${location.neighborhood}, ${location.municipality}`;
  //   } else if (location.neighborhood) {
  //     return location.neighborhood;
  //   } else if (location.municipality) {
  //     return location.municipality;
  //   } else if (location.region) {
  //     return location.region;
  //   } else if (location.country) {
  //     return location.country;
  //   } else {
  //     return location.label;
  //   }
  // };

  const createGoogleMapsDirectionUrl = (latitude, longitude) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  };

  const handleInviteUser = async (email, message) => {
    const authToken = currentUser.signInUserSession.idToken.jwtToken;
    try {
      const result = await createInvitation(eventId, email, message, authToken);
      if (result) {
        alert("Invitation sent successfully.");
        return true;
      } else {
        alert("Error creating invitation.");
        return false;
      }
    } catch (error) {
      console.error("Error creating invitation:", error);
      alert("Error creating invitation.");
      return false;
    }
  };

  if (pageLoading) {
    return (
      <div className="container mx-auto px-4 max-w-4xl pt-10 flex justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl pt-4 pb-6">
      <div className="flex flex-col mb-6 md:flex-row space-y-6 md:space-y-0">
        <Tile className="w-full max-h-96 md:w-[61.8%] md:order-2">
          {imageLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <Loading height={50} width={50} />
            </div>
          ) : (
            imageURL && (
              <img
                className="w-full h-full object-cover"
                src={imageURL}
                alt={event.name}
              />
            )
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
                <FontAwesomeIcon icon={faCrown} className="text-gray-600 mr-2 w-5" />
                <strong className="text-gray-600">Host: </strong>
                <span className="text-gray-600">
                  <Link
                    to={`/profile/${event.uid}`}
                    className="text-blue-500 hover:underline font-semibold"
                  >
                    {event.hostName}
                  </Link>
                </span>
              </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Tile className="w-full h-fit mb-6">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Discussions</h2>
            {/* Add your Discussions content here */}
          </div>
        </Tile>
        <Tile className="w-full h-fit mb-6">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">People</h2>
            <InvitedUsers
              usersData={usersData}
              isHost={currentUser.attributes.sub === event.uid}
              capacity={event.capacity}
              onInvite={handleInviteUser}
            />
          </div>
        </Tile>
      </div>
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
