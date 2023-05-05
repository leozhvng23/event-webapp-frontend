import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faRefresh } from "@fortawesome/free-solid-svg-icons";

const MessageInput = ({ onSendMessage, onRefresh }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (event) => {
    event.preventDefault();
    onSendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSendMessage} className="flex items-center mt-4 px-1">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-4 p-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-400"
        placeholder="Type your message..."
      />
      <button
        type="submit"
        disabled={!message.trim()}
        title="Post Message"
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 px-3 ml-2 transform hover:rotate-12 transition duration-500"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
      <button
        type="button"
        onClick={onRefresh}
        title="Refresh Messages"
        className="relative group bg-gray-300 hover:bg-gray-400 text-white rounded-full p-2 px-[10px] ml-2"
      >
        <FontAwesomeIcon
          icon={faRefresh}
          size="lg"
          className="transform hover:rotate-45 transition duration-500"
        />
        {/* <span className="hidden group-hover:block absolute bg-gray-100 text-gray-800 px-2 py-1 rounded-sm -top-10 left-0">
          Refresh Messages
        </span> */}
      </button>
    </form>
  );
};

export default MessageInput;
