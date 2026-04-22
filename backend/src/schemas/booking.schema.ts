import { z } from "zod";

export const bookTicketSchema = z.object({
  event_id: z.uuid("Invalid event id"),
  tickets_booked: z.coerce.number().int().min(1, "Must book at least 1 ticket"),
});

export const cancelBookingSchema = z.object({
  booking_id: z.uuid("Invalid booking id"),
});