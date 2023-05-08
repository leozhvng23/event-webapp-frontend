import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { formatTimestamp } from "../../util/formatTimestamp";

const NotificationDrawer = ({ isOpen, onClose, messages, onRemoveMessage }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const renderMessageContent = (message) => {
    if (!message.invitationStatus) {
      // turn message into an object
      return (
        <>
          <Link
            to={`/profile/${message.senderId}`}
            className="text-blue-500 hover:text-blue-800 hover:underline underline-offset-2 font-semibold"
          >
            {message.senderName}
          </Link>{" "}
          has invited you to{" "}
          <Link
            to={`/event/${message.eventId}`}
            className="text-blue-500 hover:text-blue-800 hover:underline underline-offset-2 font-semibold"
          >
            {message.eventName}
          </Link>
          {message.message && ` with a message:\n "${message.message}"`}
        </>
      );
    } else {
      return (
        <>
          <Link
            to={`/profile/${message.senderId}`}
            className="text-blue-500 hover:text-blue-800 hover:underline underline-offset-2 font-semibold"
          >
            {message.senderName}
          </Link>{" "}
          has{" "}
          <span className="font-semibold">
            {message.invitationStatus === "ACCEPTED" ? "accepted" : "declined"}
          </span>{" "}
          your invitation to{" "}
          <Link
            to={`/event/${message.eventId}`}
            className="text-blue-500 hover:text-blue-800 hover:underline underline-offset-2 font-semibold"
          >
            {message.eventName}
          </Link>
          {"."}
        </>
      );
    }
  };

  return (
    <div
      ref={drawerRef}
      className={`fixed top-0 right-0 h-full w-80 bg-gray-100 transform transition-transform duration-300 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-80  ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faAngleRight} className="text-lg mt-1" />
      </button>
      <h2 className="text-center text-xl font-semibold py-4">Notifications</h2>
      <ul>
        {messages.length > 0 ? (
          messages.map((message) => (
            <li
              key={message.MessageId}
              className="relative bg-white shadow-sm border-gray-400 rounded-md p-4 m-2 py-5"
            >
              {renderMessageContent(message.Body)}
              <span className="absolute bottom-1 right-2 text-gray-400 text-xs">
                {formatTimestamp(message.Body.timestamp) + " ago"}
              </span>
              <button
                className="absolute top-1 right-2 text-gray-400 hover:text-gray-600 text-sm"
                onClick={() => onRemoveMessage(message.MessageId)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </li>
          ))
        ) : (
          <li className="text-center py-4 text-gray-600">No messages yet</li>
        )}
      </ul>
    </div>
  );
};

export default NotificationDrawer;
