import { Hono } from "hono";
import { createEvent, getAllEvents, myEvents, getEventById, updateEvent } from "../services/eventService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { organizerOnly } from "../middlewares/roleMiddleware";
import { AppEnv } from "../services/authService";
import { cancelEvent } from "../services/eventService";

const eventRoutes = new Hono<AppEnv>();


eventRoutes.get("/", getAllEvents);
eventRoutes.get("/mine", authMiddleware, organizerOnly, myEvents); 
eventRoutes.post("/", authMiddleware, organizerOnly, createEvent);      
eventRoutes.get("/:id", getEventById);                                  
eventRoutes.put("/:id", authMiddleware, organizerOnly, updateEvent);
eventRoutes.put("/:id/cancel", authMiddleware, organizerOnly, cancelEvent);

export default eventRoutes;

