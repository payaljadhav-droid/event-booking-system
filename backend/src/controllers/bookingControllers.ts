import Event from "../models/event";
import Booking from "../models/booking";
import type { Request, Response } from "express";
import { Document, Types } from "mongoose";

interface EventDocument extends Document {
  available_tickets: number;
  total_tickets: number;
  organizer_id: Types.ObjectId;
}

export const bookTicket = async (req: Request, res: Response) => {
  try {
    const { event_id } = req.body;
    const tickets_booked = Number(req.body.tickets_booked);

    if (!event_id || !tickets_booked) {
      return res.status(400).json({
        status: "fail",
        error: { message: "missing input" },
      });
    }

    if (isNaN(tickets_booked)) {
      return res.status(400).json({
        status: "fail",
        error: { message: "invalid ticket number" },
      });
    }

    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: "fail",
        error: { message: "User not logged in" },
      });
    }

    const event = (await Event.findById(event_id)) as EventDocument | null;

    if (!event) {
      return res.status(404).json({
        status: "fail",
        error: { message: "event not found" },
      });
    }
    
    if (event.available_tickets == null) {
      event.available_tickets = event.total_tickets;
    }

    if (typeof event.available_tickets !== "number") {
      return res.status(500).json({
        status: "fail",
        error: { message: "Event tickets not initialized properly" },
      });
    }

    if (tickets_booked <= 0) {
      return res.status(400).json({
        status: "fail",
        error: { message: "invalid ticket count" },
      });
    }

    if (event.available_tickets < tickets_booked) {
      return res.status(400).json({
        status: "fail",
        error: { message: "not enough tickets to book" },
      });
    }

    event.available_tickets =
      Number(event.available_tickets) - tickets_booked;

    await event.save();

    const booking = new Booking({
      user_id: userId,
      event_id,
      tickets_booked,
    });

    await booking.save();

    res.status(201).json({
      status: "success",
      data: {
        message: "Booking successful",
        booking,
        remaining_tickets: event.available_tickets,
      },
    });

  } catch (error) {
    console.log("Error occurs:", error);
    res.status(500).json({
      status: "fail",
      error: {
        message: "booking failed",
      },
    });
  }
};

export const myBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: "fail",
        error: { message: "User not logged in" },
      });
    }

    const bookings = await Booking.find({ user_id: userId })
      .populate("event_id"); 

    console.log("Bookings:", bookings);

    res.json({
      status: "success",
      data: {
        bookings, 
      },
    });

  } catch (error) {
    console.log("MY BOOKINGS ERROR:", error);
    res.status(500).json({
      status: "fail",
      error: { message: "bookings not found" },
    });
  }
};