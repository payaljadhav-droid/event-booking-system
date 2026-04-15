import { Context } from "hono";
import { prisma } from "../db/prisma";
import { AppEnv } from "../services/authService";

export const cancelBooking = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();
    const { booking_id } = body;

    if (!booking_id) {
      return c.json(
        {
          status: "fail",
          error: {
            message: "Booking ID required",
            field: "booking_id",
          },
        },
        400
      );
    }

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

    const booking = await prisma.booking.findUnique({
      where: {
        id: booking_id,
      },
    });

    if (!booking) {
      return c.json(
        {
          status: "fail",
          error: {
            message: "Booking not found",
            field: "booking",
          },
        },
        404
      );
    }

    if (booking.user_id !== userId) {
      return c.json(
        {
          status: "fail",
          error: {
            message: "Unauthorized to cancel this booking",
          },
        },
        403
      );
    }

    const event = await prisma.event.findUnique({
      where: {
        id: booking.event_id,
      },
    });

    if (!event) {
      return c.json(
        {
          status: "fail",
          error: {
            message: "Event not found",
          },
        },
        404
      );
    }

    const [updatedEvent] = await prisma.$transaction([
      prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          available_tickets: {
            increment: booking.tickets_booked,
          },
        },
      }),
      prisma.booking.delete({
        where: {
          id: booking.id,
        },
      }),
    ]);

    return c.json(
      {
        status: "success",
        data: {
          message: "Booking cancelled successfully",
          restored_tickets: booking.tickets_booked,
          available_tickets: updatedEvent.available_tickets,
        },
      },
      200
    );
  } catch (error) {
    console.error("CANCEL ERROR:", error);

    return c.json(
      {
        status: "fail",
        error: {
          message: "Cancel booking failed",
        },
      },
      500
    );
  }
};