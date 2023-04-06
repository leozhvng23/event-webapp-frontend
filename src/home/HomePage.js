import React from "react";
import Post from "../common/components/UIElements/Post.js";
import dummyPosts from "../data/dummyPosts.json";

const HomePage = () => {
  return (
    <div className="container mx-auto">
      <div className="max-h-full overflow-y-auto pb-5">
        {dummyPosts.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
