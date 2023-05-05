import React, { useContext, useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import AuthContext from "../../common/context/AuthContext";
import { getEventById } from "../../common/api/event";
import { getImageURL } from "../../common/api/s3";
import { EditEventModal } from "../components/EditEventModal";
import Tile from "../../common/components/UIElements/Tile";
import { createMap, drawPoints } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import Loading from "../../common/components/UIElements/Loading";
import InvitedUsers from "../components/InvitedUsers";
import { createInvitation } from "../../common/api/invitation";
import { getInvitationsByEventId, updateInvitation } from "../../common/api/invitation";
import { getCommentsByEventId, createComment } from "../../common/api/comments";
import InfoModal from "../components/InfoModal";
import LoadingModal from "../../common/components/UIElements/LoadingModal";
import MessageBoard from "../components/MessageBoard";
import { generateUUID } from "../../common/util/generateId";

// import usersData from "../../data/dummyInvitedUsers.json";
// import commentsData from "../../data/dummyComments.json";

const EventPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [rsvpSending, setRsvpSending] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Sending RSVP...");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = currentUser.signInUserSession.idToken.jwtToken;
      const userEmail = currentUser.attributes.email;
      console.log("email:", userEmail);
      try {
        const fetchedEvent = await getEventById(eventId, authToken);
        const fetchedInvitations = await getInvitationsByEventId(eventId, authToken);
        const fetchedComments = await getCommentsByEventId(eventId, authToken);
        setInvitedUsers(fetchedInvitations);
        setEvent(fetchedEvent);
        setComments(fetchedComments);
        setPageLoading(false);
        if (fetchedEvent.image) {
          const url = await getImageURL(fetchedEvent.image);
          setImageURL(url);
          setImageLoading(false);
        }
        await initializeMap(fetchedEvent);
        // update rsvp status
        const userInvitation = fetchedInvitations.find(
          (invitation) => invitation.email === userEmail
        );
        if (userInvitation) {
          setRsvpStatus(userInvitation.invitationStatus);
        }
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
  }, [currentUser, eventId, rsvpStatus]);

  useEffect(() => {
    const fetchComments = async () => {
      const authToken = currentUser.signInUserSession.idToken.jwtToken;
      try {
        console.log("polling comments");
        const fetchedComments = await getCommentsByEventId(eventId, authToken);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    if (!currentUser) {
      return;
    }
    const intervalId = setInterval(() => {
      fetchComments();
    }, 600000); // 10 minutes
    // Clean up the interval when the component is unmounted or the user logs out
    return () => {
      clearInterval(intervalId);
    };
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
        alert("Invitation sent successfully!");
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

  const handleRsvp = async (status) => {
    setLoadingMessage("Sending RSVP...");
    setRsvpSending(true);
    const authToken = currentUser.signInUserSession.idToken.jwtToken;
    const requestBody = {
      eid: eventId,
      hostId: event.uid,
      hostName: event.hostName,
      uid: currentUser.attributes.sub,
      name: currentUser.attributes.name,
      email: currentUser.attributes.email,
      eventName: event.name,
      invitationStatus: status,
    };
    try {
      const result = await updateInvitation(requestBody, authToken);
      if (result) {
        setRsvpStatus(status);
        setLoadingMessage("RSVP sent successfully.");
      } else {
        alert("Error sending RSVP.");
        setRsvpSending(false);
      }
    } catch (error) {
      console.error("Error sending RSVP:", error);
      alert("Error sending RSVP.");
      setRsvpSending(false);
    }
  };

  const handleSendMessage = async (message) => {
    console.log("message:", message);
    const commentId = generateUUID();
    const newComment = {
      id: commentId,
      eid: eventId,
      uid: currentUser.attributes.sub,
      content: message,
      name: currentUser.attributes.name,
      timestamp: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
    const authToken = currentUser.signInUserSession.idToken.jwtToken;
    const requestBody = {
      id: commentId,
      eid: eventId,
      uid: currentUser.attributes.sub,
      content: message,
    };
    try {
      const result = await createComment(requestBody, authToken);
      if (result) {
        console.log("comment sent successfully!");
      } else {
        console.log("Error sending comment.");
        alert("Error posting message, please try again.");
        // delete the comment from the comments array
        const newComments = comments.filter((comment) => comment.id !== commentId);
        setComments(newComments);
      }
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  };

  const handleRefreshMessages = async () => {
    const authToken = currentUser.signInUserSession.idToken.jwtToken;
    try {
      const fetchedComments = await getCommentsByEventId(eventId, authToken);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert("Error fetching messages, please try again.");
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
        <InfoModal event={event} rsvpStatus={rsvpStatus} onRsvp={handleRsvp} />
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
        <Tile className="w-full mb-6 h-auto">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Message Board</h2>
            <MessageBoard
              messages={comments}
              currentUserId={currentUser.attributes.sub}
              onSendMessage={handleSendMessage}
              onRefresh={handleRefreshMessages}
            />
          </div>
        </Tile>
        <Tile className="w-full h-fit mb-6">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">People</h2>
            <InvitedUsers
              usersData={invitedUsers}
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
      <LoadingModal
        isOpen={rsvpSending}
        message={loadingMessage}
        onClose={() => {
          setRsvpSending(false);
        }}
      />
    </div>
  );
};

export default EventPage;
