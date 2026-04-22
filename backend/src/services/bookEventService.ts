import { Context } from "hono";
import { prisma } from "../db/prisma";
import { AppEnv } from "../services/authService";
import { bookTicketSchema } from "../schemas/booking.schema";

export const bookTicket = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();

    const parsed = bookTicketSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          status: "fail",
          error: {
            message: "Validation failed",
            details: parsed.error.flatten(),
          },
        },
        400
      );
    }

    const { event_id, tickets_booked } = parsed.data;

    const userId = c.get("user")?.id;

    if (!userId) {
      return c.json(
        {
          status: "fail",
          error: { message: "User not logged in" },
        },
        401
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: event_id },
    });

    if (!event) {
      return c.json(
        {
          status: "fail",
          error: { message: "event not found" },
        },
        404
      );
    }

    if (event.status === "CANCELLED") {
      return c.json(
        {
          status: "fail",
          error: { message: "Event is cancelled" },
        },
        400
      );
    }

    let availableTickets = event.available_tickets ?? event.total_tickets;

    if (typeof availableTickets !== "number") {
      return c.json(
        {
          status: "fail",
          error: { message: "Event tickets not initialized properly" },
        },
        500
      );
    }

    if (availableTickets < tickets_booked) {
      return c.json(
        {
          status: "fail",
          error: { message: "not enough tickets to book" },
        },
        400
      );
    }

    const updatedEvent = await prisma.event.update({
      where: { id: event_id },
      data: {
        available_tickets: availableTickets - tickets_booked,
      },
    });

    const booking = await prisma.booking.create({
      data: {
        user_id: userId,
        event_id,
        tickets_booked,
      },
    });

    return c.json(
      {
        status: "success",
        data: {
          message: "Booking successful",
          booking,
          remaining_tickets: updatedEvent.available_tickets,
        },
      },
      201
    );
  } catch (error) {
    console.log("Error occurs:", error);

    return c.json(
      {
        status: "fail",
        error: { message: "booking failed" },
      },
      500
    );
  }
};

export const myBookings = async (c: Context<AppEnv>) => {
  try {
    const userId = c.get("user")?.id;

    if (!userId) {
      return c.json(
        {
          status: "fail",
          error: { message: "Unauthorized" },
        },
        401
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { user_id: userId },
      include: { event: true },
      orderBy: { created_at: "desc" },
    });

    return c.json(
      {
        status: "success",
        data: { bookings },
        error: null,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        status: "fail",
        error: { message: "Bookings not found" },
      },
      500
    );
  }
};