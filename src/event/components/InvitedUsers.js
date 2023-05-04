import React, { useState } from "react";
import { Link } from "react-router-dom";

import InviteFriendsModal from "./InviteFriendsModal";

const InvitedUsers = ({ isHost, usersData, capacity, onInvite }) => {
  const [currentTab, setCurrentTab] = useState("ACCEPTED");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const filterDataByStatus = (status) => {
    return usersData.filter((user) => user.invitationStatus === status);
  };

  const handleInvite = () => {
    if (getCountByStatus("ACCEPTED") >= capacity) {
      alert(
        "You have reached the maximum number of guests. Try editing the event to increase the capacity."
      );
      return;
    }
    setIsInviteModalOpen(true);
  };

  const getCountByStatus = (status) => {
    return filterDataByStatus(status).length;
  };

  const filteredData = filterDataByStatus(currentTab);

  return (
    <div>
      <div className="flex mb-6 justify-between">
        <button
          className={`font-semibold text-md py-1 px-3 rounded focus:outline-none flex-1 ${
            currentTab === "ACCEPTED"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => setCurrentTab("ACCEPTED")}
        >
          Going ({getCountByStatus("ACCEPTED")})
        </button>
        <button
          className={`font-semibold text-md py-1 px-3 rounded focus:outline-none flex-1 ${
            currentTab === "DECLINED"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => setCurrentTab("DECLINED")}
        >
          Not Going ({getCountByStatus("DECLINED")})
        </button>
        <button
          className={`font-semibold text-md py-1 px-3 rounded focus:outline-none flex-1 ${
            currentTab === "PENDING"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => setCurrentTab("PENDING")}
        >
          Pending ({getCountByStatus("PENDING")})
        </button>
      </div>
      <div className="h-60 px-5 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {filteredData.map((user) => (
            <div key={user.email} className="text-gray-600 mb-1 line-clamp-1">
              {user.uid ? (
                <Link
                  to={`/profile/${user.uid}`}
                  className="text-blue-500 hover:underline font-semibold"
                >
                  {user.name}
                </Link>
              ) : (
                user.name
              )}
            </div>
          ))}
        </div>
      </div>
      {isHost && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-1 px-3 mb-2 mt-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleInvite}
          >
            Invite Friends
          </button>
        </div>
      )}
      <InviteFriendsModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={onInvite}
      />
    </div>
  );
};

export default InvitedUsers;
