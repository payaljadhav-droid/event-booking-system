import { z } from "zod";

export const aiHintSchema = z
  .object({
    hint: z.string().trim().min(3, "Please enter at least 3 characters"),
  })
  .strict();

export const aiDraftSchema = z
  .object({
    title: z.string().min(1, "Title required"),
    description: z.string().optional(),
    location: z.string().min(1, "Location required"),
    date: z.string().min(1, "Date required"),
    time: z.string().min(1, "Time required"),
    total_tickets: z.coerce.number().int().min(1, "Total tickets must be at least 1"),
  })
  .strict();

export const aiDraftResponseSchema = z
  .object({
    data: z.object({
      draft: aiDraftSchema,
    }),
  })
  .passthrough();

