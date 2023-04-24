import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../common/context/AuthContext";
import { getUserEvents } from "../../common/api/event";
import EventCard from "../components/EventCard";

const EventsPage = () => {
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = currentUser.signInUserSession.idToken.jwtToken;
      const userId = currentUser.attributes.sub;

      try {
        const fetchedEvents = await getUserEvents(userId, authToken);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  if (!events) {
    return (
      <div className="container mx-auto px-4 max-w-4xl pt-4 flex justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {isLoggedIn ? (
        <div className="grid grid-cols-1 md:grid-cols-2 pt-5 gap-6">
          {events.map((event) => (
            <div key={event.id} className="w-full">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center pt-8 text-xl">Please log in to view events</div>
      )}
    </div>
  );
};

export default EventsPage;
