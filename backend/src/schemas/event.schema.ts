import { z } from "zod";

export const eventUpsertSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().optional(),
  image_url: z.string().url("Invalid image url").optional().or(z.literal("")),
  location: z.string().min(2, "Location is too short"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:mm"),
  total_tickets: z.coerce.number().int().min(1, "Tickets must be >= 1"),
});