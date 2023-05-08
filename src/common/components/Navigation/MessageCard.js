import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const MessageCard = ({ message, onRemoveMessage, renderMessageContent }) => {
  return (
    <li className="border-b border-gray-300 p-4">
      {renderMessageContent(message)}
      <button
        className="absolute top-2 right-2 text-gray-500"
        onClick={() => onRemoveMessage(message.MessageId)}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </li>
  );
};

export default MessageCard;
