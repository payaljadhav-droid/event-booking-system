import { Hono } from "hono";
import { authMiddleware } from "../middlewares/authMiddleware";
import { organizerOnly } from "../middlewares/roleMiddleware";
import { AppEnv } from "../services/authService";
import { generateEventDraft } from "../services/aiEventDraftService";

const aiRoutes = new Hono<AppEnv>();

aiRoutes.post("/event-draft", authMiddleware, organizerOnly, generateEventDraft);

export default aiRoutes;

