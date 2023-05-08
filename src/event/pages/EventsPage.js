// src/pages/Events/EventsPage.js
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../common/context/AuthContext";
import EventsList from "../components/EventsList";

const EventsPage = () => {
  const { isLoggedIn, currentUser, lastSelectedTab, setLastSelectedTab } =
    useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState(lastSelectedTab);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLastSelectedTab(currentTab);
  }, [currentTab, setLastSelectedTab]);

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 mb-10 max-w-4xl">
      <div className="flex mt-5 mb-5 justify-between">
        <button
          className={`font-semibold text-md  md:text-lg py-1 rounded focus:outline-none hover:text-blue-600 flex-1 ${
            currentTab === "ALL"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("ALL")}
        >
          All
        </button>
        <button
          className={`font-semibold text-md md:text-lg py-1 rounded focus:outline-none hover:text-blue-600 flex-1 ${
            currentTab === "HOSTING"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("HOSTING")}
        >
          Hosting
        </button>
        <button
          className={`font-semibold text-md md:text-lg py-1 rounded focus:outline-none hover:text-blue-600 flex-1 ${
            currentTab === "INVITED"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("INVITED")}
        >
          Invited to
        </button>
      </div>
      {isLoggedIn ? (
        <EventsList
          currentUser={currentUser}
          currentTab={currentTab}
          page={page}
          setPage={setPage}
        />
      ) : (
        <div className="text-center pt-8 text-xl">Please log in to view events</div>
      )}
    </div>
  );
};

export default EventsPage;
