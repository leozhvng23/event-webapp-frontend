import React from "react";

const Post = ({ username, content, image }) => {
  return (
    <div className="bg-white rounded shadow p-4 my-4 mb-10 max-w-4xl mx-auto">
      <div className="flex items-center mb-2">
        <img
          className="w-10 h-10 rounded-full object-cover mr-2"
          src={image}
          alt={`${username}'s profile`}
        />
        <h3 className="font-bold">{username}</h3>
      </div>
      <div className="text-gray-800">{content}</div>
    </div>
  );
};

export default Post;
