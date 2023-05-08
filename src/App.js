import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBar from "./common/components/Navigation/NavBar.js";
import EventsPage from "./event/pages/EventsPage.js";
import UserPage from "./user/pages/UserPage.js";
import EventPage from "./event/pages/EventPage.js";
import AuthContext from "./common/context/AuthContext.js";
import useLongPolling from "./common/hooks/usePollQueue.js";
import { MessagesProvider, useMessages } from "./common/context/MessagesContext.js";

function AppContent() {
  const { currentUser, isLoggedIn, shouldPoll } = useContext(AuthContext);
  const { messages, dispatch } = useMessages();

  useLongPolling(shouldPoll, currentUser, isLoggedIn, (receivedMessages) => {
    receivedMessages.forEach((message) => {
      dispatch({ type: "ADD_MESSAGE", payload: message });
    });
  });

  // Log the messages in context
  console.log("Messages in context:", messages);

  return (
    <div className="pt-5">
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/profile" element={<UserPage />} />
        <Route path="/profile/:userId" element={<UserPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MessagesProvider>
        <NavBar />
        <AppContent />
      </MessagesProvider>
    </Router>
  );
}

export default App;
