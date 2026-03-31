import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { organizerOnly } from "../middlewares/roleMiddleware";
import { createEvent, getAllEvents, myEvents } from "../controllers/eventControllers"
import { bookTicket, myBookings } from "../controllers/bookingControllers";
import { cancelBooking } from "../controllers/cancelBookingController";


const router = express.Router();

router.post('/createEvent', authMiddleware, organizerOnly, createEvent);
router.get('/', getAllEvents);
router.get('/myevent', authMiddleware, myEvents);

router.post('/book', authMiddleware, bookTicket);
router.get('/mybookings', authMiddleware, myBookings);
router.post('/cancelbook', authMiddleware, cancelBooking);




export default router;