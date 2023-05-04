import React from "react";

const RSVP = ({ rsvpStatus, onRsvp }) => {
  const handleRsvpChange = (e) => {
    onRsvp(e.target.value);
  };

  const selectClassName = `bg-white border border-gray-300 rounded py-1 px-2 text-lg ${
    rsvpStatus === "PENDING" ? "text-gray-400" : "text-gray-600"
  }`;

  return (
    <div className="w-full">
      <strong className="text-gray-600 mr-2">RSVP: </strong>
      <select value={rsvpStatus} onChange={handleRsvpChange} className={selectClassName}>
        <option value="PENDING">Select</option>
        <option value="ACCEPTED">Going</option>
        <option value="DECLINED">Not Going</option>
      </select>
    </div>
  );
};

export default RSVP;
