import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import UserDashboard from "./pages/UserDashboard";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import MyBookingPage from "./pages/MyBookingPage";
import CreateEventPage from "./pages/CreateEventPage";


function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/event-details/:id" element={<EventDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookingPage />} />
        <Route path="/create-event" element={<CreateEventPage/>} />
        
      </Routes>
    </>
  );
}

export default App;