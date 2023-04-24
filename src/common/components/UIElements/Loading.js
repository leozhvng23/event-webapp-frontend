// components/Loading.js
import React from "react";
import ReactLoading from "react-loading";

const Loading = ({ type = "spin", color = "#000000", height = 50, width = 50 }) => {
  return (
    <div className="flex justify-center items-center">
      <ReactLoading type={type} color={color} height={height} width={width} />
    </div>
  );
};

export default Loading;
