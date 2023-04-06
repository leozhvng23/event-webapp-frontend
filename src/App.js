import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./shared/components/Navigation/NavBar.js";
import HomePage from "./HomePage.js";
import EventsPage from "./event/pages/EventsPage.js";
import ProfilePage from "./user/pages/ProfilePage.js";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
