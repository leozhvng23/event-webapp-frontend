// src/components/UI/Tile.js
import React from "react";

const Tile = ({ width, height, children, className }) => {
  return (
    <div
      className={`bg-gray-50 shadow-md rounded-md overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {children}
    </div>
  );
};

export default Tile;
