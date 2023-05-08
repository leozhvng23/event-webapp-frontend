// src/pages/components/EventCard.js

import React from "react";
import { Link } from "react-router-dom";
import { getImageURL } from "../../common/api/s3";
import { formatDate, formatTime } from "../../common/util/formatOutput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../common/components/UIElements/Loading";

const EventCard = ({ event }) => {
  // console.log("EventCard", event.id);
  const [imageURL, setImageURL] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchImageURL = async () => {
      const url = await getImageURL(event.image);
      setImageURL(url);
      setLoading(false);
    };

    if (event.image) {
      fetchImageURL();
    } else {
    }
  }, [event.image]);

  const getLocationLabel = (location) => {
    if (location.neighborhood) {
      return location.neighborhood;
    } else if (location.municipality) {
      return location.municipality;
    } else if (location.region) {
      return location.region;
    } else if (location.country) {
      return location.country;
    } else {
      return null;
    }
  };

  const locationLabel = getLocationLabel(event.location);

  return (
    <Link to={`/event/${event.id}`} className="block">
      <div className="bg-white shadow-md rounded-md overflow-hidden max-w-md m-auto">
        {loading ? (
          <div className="w-full h-64 flex justify-center items-center">
            <Loading height={30} width={30} />
          </div>
        ) : (
          imageURL && (
            <img className="w-full h-64 object-cover" src={imageURL} alt={event.name} />
          )
        )}
        <div className="p-4">
          <h3 className="text-lg md:text-xl font-semibold mb-2 line-clamp-1">
            {event.name}
          </h3>
          <p className="text-gray-600 line-clamp-1">{event.description}</p>
          <div className="flex items-center mt-2 text-sm md:text-[15px]">
            <FontAwesomeIcon icon={faCalendar} className="text-gray-600 mr-2" />
            <span className="text-gray-600">{formatDate(event.dateTime)}</span>
            <FontAwesomeIcon icon={faClock} className="text-gray-600 ml-4 mr-2" />
            <span className="text-gray-600">{formatTime(event.dateTime)}</span>
            {locationLabel && (
              <>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-gray-600 ml-4 mr-2"
                />
                <span className="text-gray-600 line-clamp-1">{locationLabel}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
