import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import UserDashboard from "./pages/UserDashboard";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import MyBookingPage from "./pages/MyBookingPage";
import CreateEventPage from "./pages/CreateEventPage";
import MyEvent from "./pages/MyEvent";
import RedirectIfAuth from "./routes/RedirectIfAuth";
import RequireAuth from "./routes/RequireAuth";

function App() {
  return (
    <>
      <Routes>
        <Route element={<RedirectIfAuth />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/bookings/me" element={<MyBookingPage />} />
          <Route path="/organizer/events/new" element={<CreateEventPage />} />
          <Route path="/organizer/events" element={<MyEvent />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;