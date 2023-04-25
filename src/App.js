// eslint-disable-next-line import/no-unresolved
import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBar from "./common/components/Navigation/NavBar.js";
import HomePage from "./home/HomePage.js";
import EventsPage from "./event/pages/EventsPage.js";
import UserPage from "./user/pages/UserPage.js";
import EventPage from "./event/pages/EventPage.js";
import AuthContext from "./common/context/AuthContext.js";
import useLongPolling from "./common/hooks/usePollQueue.js";
import { MessagesProvider } from "./common/context/MessagesContext.js";

function App() {
  const { currentUser, isLoggedIn, shouldPoll } = useContext(AuthContext);

  useLongPolling(shouldPoll, currentUser, isLoggedIn, (messages) => {
    console.log("Messages received:", messages);
  });

  return (
    <Router>
      <MessagesProvider>
        <NavBar />
        <div className="mt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<UserPage />} />
            <Route path="/profile/:userId" element={<UserPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/event/:eventId" element={<EventPage />} />
          </Routes>
        </div>
      </MessagesProvider>
    </Router>
  );
}

export default App;
