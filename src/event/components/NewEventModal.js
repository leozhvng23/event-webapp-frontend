import React from "react";
import Modal from "../../common/components/UIElements/Modal";

export const NewEventModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Event">
      {/* form content */}
    </Modal>
  );
};
