import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

const SignupForm = ({ onSubmit, signupUsername, signupPassword }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(signupUsername);
  const [password, setPassword] = useState(signupPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(name, email, username, password);
  };

  const tooltipContent = (
    <ul className="text-xs mt-1 text-white">
      <li>Minimum length of 8 characters</li>
      <li>Contains at least 1 number</li>
      <li>Contains at least 1 special character</li>
      <li>Contains at least 1 uppercase letter</li>
      <li>Contains at least 1 lowercase letter</li>
    </ul>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
          <a
            className="ml-1 text-blue-500 cursor-pointer"
            data-tooltip-id="passwordTooltip"
          >
            ⓘ
          </a>
          <Tooltip id="passwordTooltip" place="top" effect="solid">
            {tooltipContent}
          </Tooltip>
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
