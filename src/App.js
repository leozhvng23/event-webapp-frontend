// eslint-disable-next-line import/no-unresolved
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBar from "./common/components/Navigation/NavBar.js";
import HomePage from "./home/HomePage.js";
import EventsPage from "./event/pages/EventsPage.js";
import ProfilePage from "./user/pages/ProfilePage.js";
import EventPage from "./event/pages/EventPage.js";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="mt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/event/:eventId" element={<EventPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
