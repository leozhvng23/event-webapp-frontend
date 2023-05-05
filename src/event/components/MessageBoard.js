import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { formatTimestamp } from "../../common/util/formatTimestamp";
import MessageInput from "./MessageInput";

const MessageBoard = ({ messages, currentUserId, onSendMessage, onRefresh }) => {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[295px] justify-between">
      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto px-4 bg-gray-100 rounded-lg shadow-inner"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500 text-lg">Be the first to post a message!</span>
          </div>
        ) : (
          <>
            <div className="h-2"></div>
            {messages.map((message) => {
              const isCurrentUser = message.uid === currentUserId;

              return (
                <div key={message.id} className="mb-2">
                  <div
                    className={`px-4 py-2 rounded-xl ${
                      isCurrentUser
                        ? "bg-blue-500 text-white float-right"
                        : "bg-gray-300 text-black float-left"
                    }`}
                    style={{ maxWidth: "80%" }}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  <div className="clear-both"></div>
                  <div
                    className={`text-xs text-gray-500 px-1 mt-[2px] flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <Link
                      to={`/profile/${message.uid}`}
                      className="mr-2 font-semibold text-gray-500 hover:text-blue-600"
                    >
                      {message.name}
                    </Link>
                    <span>{formatTimestamp(message.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      <MessageInput onSendMessage={onSendMessage} onRefresh={onRefresh} />
    </div>
  );
};

export default MessageBoard;
