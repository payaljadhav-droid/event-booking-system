import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password required"),
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

