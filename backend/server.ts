import express from "express";
import session from "express-session";
import authRoutes from "./src/routes/authRoutes";
import eventRoutes from "./src/routes/eventRoutes";
import connectDB from "./src/config/db";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true                 
}));

dotenv.config();

app.use(express.json());

connectDB();
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

app.get("/", (req, res) => {
  res.send("app is running....");
});

app.get("/check-session", (req, res) => {
  res.json(req.session);
});

app.use("/auth", authRoutes);

app.use("/event", eventRoutes);

app.listen(8080, () => {
  console.log("server is running");
});

export default app;
