import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const MessageInput = ({ onSendMessage }) => {
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
        className="w-full px-4 p-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
        placeholder="Type your message..."
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 px-3 ml-2"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
};

export default MessageInput;
