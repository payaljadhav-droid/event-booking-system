import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { organizerOnly } from "../middlewares/roleMiddleware";
import { createEvent, getAllEvents, myEvents, getEventById } from "../controllers/eventControllers"
import { bookTicket, myBookings } from "../controllers/bookingControllers";
import { cancelBooking } from "../controllers/cancelBookingController";

const router = express.Router();

router.post("/createEvent", authMiddleware, organizerOnly, createEvent);
router.get("/", getAllEvents);
router.get("/myevent", authMiddleware, myEvents);
router.get("/mybookings", authMiddleware, myBookings);
router.post("/book", authMiddleware, bookTicket);
router.post("/cancelbook", authMiddleware, cancelBooking);
router.get("/:id", getEventById);

export default router;