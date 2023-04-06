import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.js";
import HomePage from "./components/HomePage/HomePage.js";
import EventsPage from "./components/EventsPage/EventsPage.js";
import ProfilePage from "./components/ProfilePage/ProfilePage.js";

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
