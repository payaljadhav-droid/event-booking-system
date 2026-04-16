import { Context } from "hono";
import { prisma } from "../db/prisma";
import { AppEnv } from "../services/authService";

export const bookTicket = async (c: Context<AppEnv>) => {
  try {
    console.log("booking route hits");
    const body = await c.req.json();

    const event_id = body.event_id;
    const tickets_booked = Number(body.tickets_booked);

    if (!event_id || !tickets_booked) {
      return c.json(
        {
          status: "fail",
          error: { message: "missing input" },
        },
        400,
      );
    }

    if (isNaN(tickets_booked)) {
      return c.json(
        {
          status: "fail",
          error: { message: "invalid ticket number" },
        },
        400,
      );
    }

    const userId = c.get("user")?.id;

    if (!userId) {
      return c.json(
        {
          status: "fail",
          error: { message: "User not logged in" },
        },
        401,
      );
    }

    const event = await prisma.event.findUnique({
      where: {
        id: event_id,
      },
    });

    console.log(event);

    if (!event) {
      return c.json(
        {
          status: "fail",
          error: { message: "event not found" },
        },
        404,
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

    let availableTickets = event.available_tickets;

    if (availableTickets == null) {
      availableTickets = event.total_tickets;
    }

    if (typeof availableTickets !== "number") {
      return c.json(
        {
          status: "fail",
          error: { message: "Event tickets not initialized properly" },
        },
        500,
      );
    }

    if (tickets_booked <= 0) {
      return c.json(
        {
          status: "fail",
          error: { message: "invalid ticket count" },
        },
        400,
      );
    }

    if (availableTickets < tickets_booked) {
      return c.json(
        {
          status: "fail",
          error: { message: "not enough tickets to book" },
        },
        400,
      );
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: event_id,
      },
      data: {
        available_tickets: availableTickets - tickets_booked,
      },
    });

    const booking = await prisma.booking.create({
      data: {
        user_id: userId,
        event_id: event_id,
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
      201,
    );
  } catch (error) {
    console.log("Error occurs:", error);

    return c.json(
      {
        status: "fail",
        error: {
          message: "booking failed",
        },
      },
      500,
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
          error: { message: "User not logged in" },
        },
        401,
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        user_id: userId,
      },
      include: {
        event: true,
      },
    });

    console.log("Bookings:", bookings);

    return c.json({
      status: "success",
      data: {
        bookings,
      },
    });
  } catch (error) {
    console.log("MY BOOKINGS ERROR:", error);

    return c.json(
      {
        status: "fail",
        error: { message: "bookings not found" },
      },
      500,
    );
  }
};
