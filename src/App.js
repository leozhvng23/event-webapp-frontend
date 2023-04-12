import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserContext from "./common/context/UserContext.js";

import NavBar from "./common/components/Navigation/NavBar.js";
import HomePage from "./home/HomePage.js";
import EventsPage from "./event/pages/EventsPage.js";
import ProfilePage from "./user/pages/ProfilePage.js";

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <NavBar />
        <div className="mt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
