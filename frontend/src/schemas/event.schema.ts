import { z } from "zod";

export const createOrUpdateEventSchema = z
  .object({
    title: z.string().min(1, "Event title required"),
    description: z.string().min(1, "Description required"),
    location: z.string().min(1, "Location required"),
    date: z.string().min(1, "Date required"),
    time: z.string().min(1, "Time required"),
    total_tickets: z.coerce
      .number()
      .int("Total tickets must be an integer")
      .min(1, "Total tickets must be at least 1"),
    image_url: z.string().url("Invalid image url").optional().or(z.literal("")),
  })
  .strict();

export const eventSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    location: z.string(),
    image_url: z.string().optional().nullable(),
    total_tickets: z.number().optional(),
    date_time: z.union([z.string(), z.date()]).optional().nullable(),
  })
  .passthrough();

export const getEventResponseSchema = z
  .object({
    data: z.object({
      event: eventSchema,
    }),
  })
  .passthrough();

