import { Context } from "hono";
import { prisma } from "../db/prisma";
import { AppEnv } from "../services/authService";

export const createEvent = async (c: Context<AppEnv>) => {
  try {
    console.log("create route hits!!!");
    const body = await c.req.json();
    const { title, description,image_url, location, date,time, total_tickets } = body;
    
    const user = c.get("user");

    if (!user) {
      return c.json({
        status: "fail",
        error: { message: "Unauthorized" },
      }, 401);
    }
    
    const date_time = new Date(`${date}T${time}`);

    if (!title || !date_time || !total_tickets) {
      return c.json({
        status: "fail",
        error: { message: "Missing required fields" },
      }, 400);
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        image_url,
        location,
        date_time: date_time,
        total_tickets,
        available_tickets: total_tickets,
        organizer_id: user.id,
      },
    });
    
    console.log(event);

    return c.json({
      status: "success",
      data: {
        event,
        message: "Event created successfully",
      },
      error: null,
    }, 201);

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    console.log("ERROR:", message);

    return c.json({
      status: "fail",
      error: { message },
    }, 500);
  }
};

export const getAllEvents = async (c: Context<AppEnv>) => {
  try {
    const events = await prisma.event.findMany();

    return c.json({
      status: "success",
      data: { events },
      error: null,
    }, 200);

  } catch (error) {
    return c.json({
      status: "fail",
      error: { message: "Events not found" },
    }, 500);
  }
};

export const myEvents = async (c: Context<AppEnv>) => {
  try {
    const user = c.get("user");

    if (!user) {
      return c.json({
        status: "fail",
        error: { message: "Unauthorized" },
      }, 401);
    }

    const events = await prisma.event.findMany({
      where: {
        organizer_id: user.id,
      },
    });

    return c.json({
      status: "success",
      data: { events },
      error: null,
    }, 200);

  } catch (error) {
    return c.json({
      status: "fail",
      error: { message: "Events not found" },
    }, 500);
  }
};

export const getEventById = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");

    const event = await prisma.event.findUnique({
      where: {
        id: String (id),
      },
    });

    if (!event) {
      return c.json({
        status: "fail",
        error: { message: "Event not found" },
      }, 404);
    }

    return c.json({
      status: "success",
      data: { event },
      error: null,
    }, 200);

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return c.json({
      status: "fail",
      error: { message },
    }, 500);
  }
};