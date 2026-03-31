import Event from "../models/event";
import type { Request, Response } from "express";

export const createEvent = async (req:Request, res:Response) => {
  try {
    const { title, description, location, date_time, total_tickets } = req.body;
    
    const event = new Event({
      title,
      description,
      location,
      date_time,
      total_tickets,
      available_tickets:total_tickets,
      organizer_id: req.user?.id
    });
    
    await event.save();
    res.status(201).json({
      status: "success",
      data: {
        event: event,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
      console.log("ERROR:", message);
      res.status(500).json({
      status: "fail",
      error: {
        message: message,
      },
    });
  }
};

export const getAllEvents = async (req:Request, res:Response) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      status: "success",
      data: {
        events
      },
      error: null
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error:{
        message: "events not found",
      },
    });
  }
};

export const myEvents = async (req:Request, res:Response) => {
  try {
    const events = await Event.find({ organizer_id: req.user?.id });
    console.log("EVENTS:", events); 
    res.status(200).json({
      status: "success",
      data: {
        events
      },
      error: null
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error:{
        message: "events not found",
      },
    });
  }
};