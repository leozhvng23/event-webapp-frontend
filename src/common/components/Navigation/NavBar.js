import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

import { NewEventModal } from "../../../event/components/NewEventModal";
import { NewAnnouncementModal } from "../../../announcement/components/NewAnnouncementModal";

const DropDownMenu = ({ isOpen, onNewEvent, onNewAnnouncement }) => {
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

const NavBar = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isNewAnnouncementModalOpen, setIsNewAnnouncementModalOpen] = useState(false);

  const handleNewEvent = () => {
    setIsDropDownOpen(false);
    setIsNewEventModalOpen(true);
  };

  const handleNewAnnouncement = () => {
    setIsDropDownOpen(false);
    setIsNewAnnouncementModalOpen(true);
  };

  const closeModals = () => {
    setIsNewEventModalOpen(false);
    setIsNewAnnouncementModalOpen(false);
  };

  return (
    <nav className="bg-blue-500 p-4 top-0 fixed w-full z-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-white font-bold text-xl">Site Logo</h1>
          <div className="flex items-center space-x-4">
            <Link className="text-white hover:text-blue-200" to="/">
              Home
            </Link>
            <Link className="text-white hover:text-blue-200" to="/events">
              Events
            </Link>
            <div className="relative">
              <button
                className="text-white hover:text-blue-200"
                onClick={() => setIsDropDownOpen(!isDropDownOpen)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <DropDownMenu
                isOpen={isDropDownOpen}
                onNewEvent={handleNewEvent}
                onNewAnnouncement={handleNewAnnouncement}
              />
            </div>
            <button
              className="text-white hover:text-blue-200"
              onClick={() => (window.location.href = "/profile")}
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
          </div>
        </div>
      </div>
      <NewEventModal isOpen={isNewEventModalOpen} onClose={closeModals} />
      <NewAnnouncementModal isOpen={isNewAnnouncementModalOpen} onClose={closeModals} />
    </nav>
  );
};

export default NavBar;
