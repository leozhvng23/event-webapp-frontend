import React, { useContext, useState, useEffect, useCallback } from "react";
import AuthContext from "../../common/context/AuthContext";
import { getUserEvents } from "../../common/api/event";
import EventCard from "../components/EventCard";
import Loading from "../../common/components/UIElements/Loading";

const EventsPage = () => {
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 6;
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentTab, setCurrentTab] = useState("ALL");

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

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    setPage(1);
  };

  useEffect(() => {
    setEvents([]);
    setPage(1);
    setHasMore(true);
  }, [currentTab]);

  const handleScroll = useCallback(() => {
    if (!hasMore || loadingMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.offsetHeight;

    if (scrollTop + windowHeight >= docHeight - 50) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loadingMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  if (isLoggedIn && loading) {
    return (
      <div className="container mx-auto px-4 max-w-4xl pt-10 flex justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mb-10 max-w-4xl">
      <div className="flex mb-5 justify-between">
        <button
          className={`font-semibold text-md py-1 rounded focus:outline-none hover:text-blue-600 flex-1 ${
            currentTab === "ALL"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("ALL")}
        >
          All
        </button>
        <button
          className={`font-semibold text-md py-1 rounded focus:outline-none hover:text-blue-600 flex-1 ${
            currentTab === "HOSTING"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("HOSTING")}
        >
          Hosting
        </button>
        <button
          className={`font-semibold text-md py-1 rounded focus:outline-none hover:text-blue-600 flex-1 ${
            currentTab === "INVITED"
              ? "text-gray-600 underline underline-offset-8 decoration-2"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("INVITED")}
        >
          Invited
        </button>
      </div>
      {isLoggedIn ? (
        events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 py-5 gap-6">
              {events.map((event) => (
                <div key={event.id} className="w-full">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
            {loadingMore && (
              <div className="flex justify-center py-4">
                <Loading />
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400 pt-8 text-xl">
            You don't have any events yet.
          </div>
        )
      ) : (
        <div className="text-center pt-8 text-xl">Please log in to view events</div>
      )}
    </div>
  );
};

export default EventsPage;
