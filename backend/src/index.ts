import { Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { prisma } from "./db/prisma";
import { sessionMiddleware, MemoryStore } from "hono-sessions";
import authRoutes from "./routes/authRoutes";
import { AppEnv } from "./services/authService";
import eventRoutes from "./routes/eventRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import { cors } from "hono/cors";
import aiRoutes from "./routes/aiRoutes";

const app = new Hono<AppEnv>();

app.use(
  "*",
  cors({
    origin: ["https://event-booking-system-gamma.vercel.app"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  "*",
  sessionMiddleware({
    store: new MemoryStore(),
    encryptionKey: process.env.SESSION_SECRET!,

    cookieOptions: {
      maxAge: 60 * 60, 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
    },
  }),
  
);

app.get("/", async (c) => {
  return c.text("Server running");
});

app.get("/users", async (c) => {
  const users = await prisma.user.findMany();
  return c.json(users);
});

app.route("/api/auth", authRoutes);
app.route("/api/events", eventRoutes);
app.route("/api/bookings", bookingRoutes);
app.route("/api/ai", aiRoutes);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Listening on ${info.address}:${info.port}`);
  },
);
