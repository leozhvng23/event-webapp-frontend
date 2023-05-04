import React from "react";
import Modal from "./Modal";

const LoadingModal = ({ isOpen, onClose, message = "Loading..." }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Please Wait"
      disableClickOutside={false}
    >
      <div className="flex w-fit px-10 pb-4 items-center justify-center">
        <p>{message}</p>
      </div>
    </Modal>
  );
};

export default LoadingModal;
