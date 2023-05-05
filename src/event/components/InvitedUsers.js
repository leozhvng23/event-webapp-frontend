import React, { useState } from "react";
import { Link } from "react-router-dom";

const InvitedUsers = ({ usersData, capacity }) => {
  const [currentTab, setCurrentTab] = useState("ACCEPTED");

  const filterDataByStatus = (status) => {
    return usersData.filter((user) => user.invitationStatus === status);
  };

  const getCountByStatus = (status) => {
    return filterDataByStatus(status).length;
  };

  const filteredData = filterDataByStatus(currentTab);

  return (
    <div className="h-full">
      <div className="flex mb-5 justify-between">
        <button
          className={`font-semibold text-md py-1 rounded focus:outline-none hover:text-blue-600 flex-1 ${
            currentTab === "ACCEPTED"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => setCurrentTab("ACCEPTED")}
        >
          Going ({getCountByStatus("ACCEPTED")})
        </button>
        <button
          className={`font-semibold text-md py-1 rounded focus:outline-none hover:text-blue-600 flex-1 ${
            currentTab === "DECLINED"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => setCurrentTab("DECLINED")}
        >
          Not Going ({getCountByStatus("DECLINED")})
        </button>
        <button
          className={`font-semibold text-md py-1 rounded focus:outline-none hover:text-blue-600 flex-1 ${
            currentTab === "PENDING"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => setCurrentTab("PENDING")}
        >
          Pending ({getCountByStatus("PENDING")})
        </button>
      </div>
      <div className="overflow-y-auto h-[265px] px-5 bg-gray-100 rounded-lg shadow-inner">
        <div className="grid grid-cols-2 gap-4">
          <div></div>
          <div></div>
          {filteredData.map((user) => (
            <div key={user.email} className="text-gray-600 line-clamp-1">
              {user.uid ? (
                <Link
                  to={`/profile/${user.uid}`}
                  className="text-blue-500 hover:underline hover:text-blue-600 font-semibold"
                >
                  {user.name || user.email}
                </Link>
              ) : (
                user.name || user.email
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvitedUsers;
