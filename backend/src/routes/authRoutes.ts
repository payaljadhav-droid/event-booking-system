import { Hono } from "hono";
import { registerUser, loginUser, logoutUser, AppEnv } from "../services/authService";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRoutes = new Hono<AppEnv>();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", logoutUser);


authRoutes.get("/me", authMiddleware, (c) => {
  const user = c.get("user");

  return c.json({
    status: "success",
    data: user,
  });
});

export default authRoutes;