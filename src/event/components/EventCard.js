// src/pages/components/EventCard.js

import React from "react";
import { Link } from "react-router-dom";
import { getImageURL } from "../../common/api/s3";
import { formatDate, formatTime } from "../../common/util/formatOutput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";

const EventCard = ({ event }) => {
  console.log("EventCard", event.id);
  const [imageURL, setImageURL] = React.useState(null);

  React.useEffect(() => {
    const fetchImageURL = async () => {
      const url = await getImageURL(event.image);
      setImageURL(url);
    };

    if (event.image) {
      fetchImageURL();
    }
  }, [event.image]);

  return (
    <Link to={`/event/${event.id}`} className="block">
      <div className="bg-white shadow-md rounded-md overflow-hidden max-w-sm mx-auto my-6">
        {imageURL && (
          <img className="w-full h-64 object-cover" src={imageURL} alt={event.name} />
        )}
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
          <p className="text-gray-600">{event.description}</p>
          <div className="flex items-center mt-2">
            <FontAwesomeIcon icon={faCalendar} className="text-gray-600 mr-2" />
            <span className="text-gray-600">{formatDate(event.dateTime)}</span>
            <FontAwesomeIcon icon={faClock} className="text-gray-600 ml-4 mr-2" />
            <span className="text-gray-600">{formatTime(event.dateTime)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
