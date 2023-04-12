// src/components/ConfirmSignupForm.js
import React, { useState } from "react";

const ConfirmSignupForm = ({ onSubmit, username }) => {
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(username, confirmationCode);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="confirmationCode"
        >
          Enter Confirmation Code Sent to Your Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="confirmationCode"
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
      </div>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Confirm
        </button>
      </div>
    </form>
  );
};

export default ConfirmSignupForm;
