import Booking from "../models/booking";
import type { Request, Response } from "express";
import Event from "../models/event";
import { Document, Types } from "mongoose";

interface EventDocument extends Document {
  available_tickets: number;
  total_tickets: number;
  organizer_id: Types.ObjectId;
};

interface BookingType extends Document {
  tickets_booked: number;
  event_id: string;
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({
        status: "fail",
        error:{
          message: "Booking ID required",
          field:"booking_id",
        },
      });
    }

    const booking = await Booking.findById(booking_id)as BookingType | null;

    if (!booking) {
      return res.status(404).json({
        status: "fail",
        error:{
          message: "Booking not found",
          field:"booking",
        },
      });
    }

    const event = await Event.findById(booking.event_id) as EventDocument | null;

    if (!event) {
      return res.status(404).json({
        status: "fail",
        error:{
          message: "Event not found",
        },
      });
    }

    event.available_tickets += booking.tickets_booked;
    await event.save();

    await booking?.deleteOne();

    res.status(201).json({
      status: "success",
      data: {
        message: "Booking cancelled successfully",
        restored_tickets: booking.tickets_booked,
        available_tickets: event.available_tickets
      },
    });

  } catch (error) {
    console.error("CANCEL ERROR:", error);
    res.status(500).json({
      status: "fail",
      error:{
        message: "Cancel booking failed",
      },
    });
  }
};