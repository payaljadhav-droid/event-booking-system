import { Context, Next } from "hono";
import { AppEnv } from "../services/authService";

export const authMiddleware = async (c: Context<AppEnv>, next: Next) => {

  const session = c.get("session");
  const user = session?.get("user");

  if (!user) {
    return c.json({
      status: "fail",
      error: {
        message: "Unauthorized",
      },
    }, 401);
  }

  c.set("user", user);

  await next();
};