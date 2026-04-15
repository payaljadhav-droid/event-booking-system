import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import UserDashboard from "./pages/UserDashboard";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import MyBookingPage from "./pages/MyBookingPage";
import CreateEventPage from "./pages/CreateEventPage";
import MyEvent from "./pages/MyEvent";


function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/event-details/:id" element={<EventDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookingPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/my-event" element={<MyEvent/>} />
        
      </Routes>
    </>
  );
}

export default App;