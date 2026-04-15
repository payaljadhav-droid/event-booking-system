import { Context, Next } from "hono";
import { AppEnv } from "../services/authService";

export const organizerOnly = async (c: Context<AppEnv>, next: Next) => {
  const user = c.get("user");

  if (!user || user.role !== "organizer") {
    return c.json({
      status: "fail",
      error: {
        message: "Organizers only",
      },
    }, 403);
  }

  await next();
};