import { Hono } from "hono";
import { bookTicket, myBookings } from "../services/bookEventService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AppEnv } from "../services/authService";
import { cancelBooking } from "../services/cancelService";

const bookingRoutes = new Hono<AppEnv>();

bookingRoutes.post("/", authMiddleware, bookTicket);
bookingRoutes.get("/mine", authMiddleware, myBookings);
bookingRoutes.delete("/:id", authMiddleware,cancelBooking );

export default bookingRoutes;