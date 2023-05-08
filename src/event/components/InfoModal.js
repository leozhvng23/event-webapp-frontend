import Tile from "../../common/components/UIElements/Tile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faUsers,
  faLock,
  faGlobe,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { formatDate, formatTime } from "../../common/util/formatOutput";
import RSVP from "./RSVP";

const InfoModal = ({ isHost, event, rsvpStatus, onRsvp, onClickInvite }) => {
  return (
    <Tile className="w-full md:w-[38.2%] max-h-fit md:order-1 md:mr-6">
      <div className="p-4">
        <div className="flex items-center w-full h-14 mt-4 mb-4">
          <span
            className={`font-semibold w-full ${
              event.name.length > 30 ? "text-xl" : "text-3xl"
            }`}
          >
            {event.name}
          </span>
        </div>
        <p className="text-gray-600 font-semibold mb-2">{event.description}</p>
        <div className="w-full items-start mb-4">
          <div className="w-full">
            <FontAwesomeIcon icon={faCrown} className="text-gray-600 mr-2 w-5" />
            <strong className="text-gray-600">Host: </strong>
            <span>
              <Link
                to={`/profile/${event.uid}`}
                className="text-blue-500 hover:underline hover:text-blue-600 font-semibold"
              >
                {event.hostName}
              </Link>
            </span>
          </div>
          <div className="w-full">
            <FontAwesomeIcon icon={faCalendar} className="text-gray-600 mr-2 w-5" />
            <strong className="text-gray-600">Date: </strong>
            <span className="text-gray-600">{formatDate(event.dateTime)}</span>
          </div>
          <div className="w-full">
            <FontAwesomeIcon icon={faClock} className="text-gray-600 mr-2 w-5" />
            <strong className="text-gray-600">Time: </strong>
            <span className="text-gray-600">{formatTime(event.dateTime)}</span>
          </div>
          <div className="w-full">
            <FontAwesomeIcon icon={faUsers} className="text-gray-600 mr-2 w-5" />
            <strong className="text-gray-600">Capacity: </strong>
            <span className="text-gray-600">{event.capacity}</span>
          </div>
          {/* <div className="w-full line-clamp-1">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-gray-600 mr-2 w-5"
            />
            <strong className="text-gray-600">Location: </strong>
            <span className="text-gray-600">{getLocationLabel(event.location)}</span>
          </div> */}
          <div className="w-full mb-4">
            <FontAwesomeIcon
              icon={event.isPublic ? faGlobe : faLock}
              className="text-gray-600 mr-2 w-5"
            />
            <strong className="text-gray-600">Visibility: </strong>
            <span className="text-gray-600">{event.isPublic ? "Public" : "Private"}</span>
          </div>
          {rsvpStatus !== "" && !isHost && (
            <RSVP rsvpStatus={rsvpStatus} onRsvp={onRsvp} />
          )}
        </div>
        {isHost && (
          <div className="flex justify-center mt-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-md py-1 px-3 mb-2 mt-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onClickInvite}
            >
              Invite Friends
            </button>
          </div>
        )}
      </div>
    </Tile>
  );
};

export default InfoModal;
