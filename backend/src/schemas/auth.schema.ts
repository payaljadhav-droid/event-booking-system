import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
  role: z.enum(["user", "organizer"]),
}).strict();

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password required"),
}).strict();