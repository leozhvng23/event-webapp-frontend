import React from "react";
import Modal from "../../common/components/UIElements/Modal";

export const NewAnnouncementModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Announcement">
      {/* form content */}
    </Modal>
  );
};
