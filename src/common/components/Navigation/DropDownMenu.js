import React from "react";

export const DropDownMenu = ({ isOpen, onNewEvent, onNewAnnouncement }) => {
  if (!isOpen) return null;
  return (
    <div
      className="bg-white text-gray-700 mt-2 rounded shadow absolute left-1/2 transform -translate-x-1/2 w-min"
      style={{ zIndex: 1000 }}
    >
      <button
        onClick={onNewEvent}
        className="block w-full text-left p-3 rounded-t whitespace-nowrap hover:bg-gray-200"
      >
        Event
      </button>
      <button
        onClick={onNewAnnouncement}
        className="block w-full text-left p-3 rounded-b whitespace-nowrap hover:bg-gray-200"
      >
        Announcement
      </button>
    </div>
  );
};
