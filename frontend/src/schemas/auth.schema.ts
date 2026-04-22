import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password required"),
  })
  .strict();

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars"),
    role: z.enum(["user", "organizer"], { message: "Role missing" }),
  })
  .strict();

export const loginResponseSchema = z
  .object({
    data: z
      .object({
        user: z
          .object({
            id: z.union([z.string(), z.number()]),
            role: z.string().min(1, "Role missing"),
            name: z.string().optional(),
            email: z.email("Invalid email").optional(),
          })
          .passthrough(),
      })
      .passthrough(),
  })
  .passthrough();

