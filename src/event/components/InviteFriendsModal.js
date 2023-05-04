import React, { useState } from "react";

import Modal from "../../common/components/UIElements/Modal";

const InviteFriendsModal = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const resetInputFields = () => {
    setEmail("");
    setMessage("");
  };

  const handleInvite = async (email, message) => {
    console.log("Inviting", email, "with message:", message);
    setIsSending(true);
    const result = await onInvite(email, message);
    if (result) {
      resetInputFields();
      onClose();
    }
    setIsSending(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleInvite(email, message);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={"Invite Friends"}>
      <form onSubmit={handleSubmit} className="w-80">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
            Message (optional)
          </label>
          <textarea
            id="message"
            name="message"
            className="shadow appearance-none border rounded w-full py-2 mb-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-center mb-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-1 px-3 rounded focus:outline-none focus:shadow-outline"
          >
            {isSending ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteFriendsModal;
