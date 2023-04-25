import { useEffect, useRef } from "react";
import { longPollQueue } from "../api/sqs";

const useLongPolling = (shouldPoll, currentUser, isLoggedIn, onMessagesReceived) => {
  const stopPollingRef = useRef(null);

  useEffect(() => {
    if (shouldPoll && currentUser && isLoggedIn) {
      const userEmail = currentUser.attributes.email;
      if (typeof onMessagesReceived !== "function") {
        console.error("onMessagesReceived must be a function");
        return;
      }

      console.log("Starting long polling for user:", userEmail);

      longPollQueue(userEmail, onMessagesReceived, (error) => {
        console.error("Error in long polling:", error);

        if (stopPollingRef.current) {
          stopPollingRef.current();
        }
      }).then((stopPolling) => {
        stopPollingRef.current = stopPolling;
      });
    } else {
      console.log("Long polling stopped");
      if (stopPollingRef.current) {
        stopPollingRef.current();
      }
    }

    return () => {
      if (stopPollingRef.current) {
        console.log("Cleanup: stopping long polling");
        stopPollingRef.current();
      }
    };
  }, [isLoggedIn, currentUser, onMessagesReceived, shouldPoll]);
};

export default useLongPolling;
