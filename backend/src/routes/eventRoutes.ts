import { Hono } from "hono";
import { createEvent, getAllEvents, myEvents, getEventById } from "../services/eventService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { organizerOnly } from "../middlewares/roleMiddleware";
import { AppEnv } from "../services/authService";

const eventRoutes = new Hono<AppEnv>();


eventRoutes.get("/", getAllEvents);
eventRoutes.get("/myevents", authMiddleware, organizerOnly, myEvents); 
eventRoutes.post("/", authMiddleware, organizerOnly, createEvent);      
eventRoutes.get("/:id", getEventById);                                  

export default eventRoutes;

