// src/components/EventsList.js
import React, { useState, useEffect, useCallback } from "react";
import { getUserEvents } from "../../common/api/event";
import EventCard from "../components/EventCard";
import Loading from "../../common/components/UIElements/Loading";

const EventsList = ({ currentUser, currentTab, page, setPage }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!currentUser) return;

    const authToken = currentUser.signInUserSession.idToken.jwtToken;
    const userId = currentUser.attributes.sub;

    try {
      const fetchedEvents = await getUserEvents(
        userId,
        authToken,
        page,
        limit,
        currentTab
      );
      if (fetchedEvents.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (currentTab !== "ALL" || page === 1) {
        setEvents(fetchedEvents);
      } else {
        setEvents((prevEvents) => [...prevEvents, ...fetchedEvents]);
      }
    } catch (error) {
      console.error("Error fetching user events:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [currentUser, page, limit, currentTab]);

  useEffect(() => {
    setLoading(page === 1);
    fetchEvents().then(() => {
      setLoading(false);
    });
  }, [fetchEvents, currentTab, page]);

  useEffect(() => {
    setPage(1);
  }, [currentTab, setPage]);

  const handleScroll = useCallback(() => {
    if (!hasMore || loadingMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.offsetHeight;

    if (scrollTop + windowHeight >= docHeight - 50) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loadingMore, setPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 max-w-4xl pt-10 flex justify-center">
        <Loading />
      </div>
    );
  }

  const renderNoEventsMessage = () => {
    if (currentTab === "ALL") {
      return "No events yet, try creating an event";
    } else if (currentTab === "HOSTING") {
      return "No events yet, try creating an event";
    } else if (currentTab === "INVITED") {
      return "No invited events";
    }
  };

  return (
    <>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 py-5 gap-6">
          {events.map((event) => (
            <div key={event.id} className="w-full">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 pt-8 text-xl">
          {renderNoEventsMessage()}
        </div>
      )}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <Loading />
        </div>
      )}
    </>
  );
};

export default EventsList;
