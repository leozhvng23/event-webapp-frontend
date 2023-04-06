import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-white font-bold text-xl">Site Logo</h1>
          <div className="flex items-center space-x-4">
            <Link className="text-white hover:text-blue-200" to="/">
              Home
            </Link>
            <Link className="text-white hover:text-blue-200" to="/events">
              Events
            </Link>
            <button className="text-white hover:text-blue-200">
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              className="text-white hover:text-blue-200"
              onClick={() => (window.location.href = "/profile")}
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
