import { Context } from "hono";
import { prisma } from "../db/prisma";
import { AppEnv } from "../services/authService";
import { z } from "zod";
import { eventUpsertSchema } from "../schemas/event.schema";

const updateEventSchema = eventUpsertSchema.partial();

const idParamSchema = z.object({
  id: z.string().min(1, "Invalid id"),
});

const getErrorMessage = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
};

export const createEvent = async (c: Context<AppEnv>) => {
  try {
    const user = c.get("user");

    if (!user) {
      return c.json(
        { status: "fail", error: { message: "Unauthorized" } },
        401
      );
    }

    const body = eventUpsertSchema.parse(await c.req.json());

    const { title, description, image_url, location, date, time, total_tickets } =
      body;

    const date_time = new Date(`${date}T${time}`);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        image_url,
        location,
        date_time,
        total_tickets,
        available_tickets: total_tickets,
        organizer_id: user.id,
      },
    });

    return c.json(
      {
        status: "success",
        data: { event, message: "Event created successfully" },
        error: null,
      },
      201
    );
  } catch (error) {
    return c.json(
      { status: "fail", error: { message: getErrorMessage(error) } },
      400
    );
  }
};

export const getAllEvents = async (c: Context<AppEnv>) => {
  try {
    const events = await prisma.event.findMany({
      where: { status: "ACTIVE" },
    });

    return c.json(
      { status: "success", data: { events }, error: null },
      200
    );
  } catch {
    return c.json(
      { status: "fail", error: { message: "Events not found" } },
      500
    );
  }
};

export const myEvents = async (c: Context<AppEnv>) => {
  try {
    const user = c.get("user");

    if (!user) {
      return c.json(
        { status: "fail", error: { message: "Unauthorized" } },
        401
      );
    }

    const events = await prisma.event.findMany({
      where: { organizer_id: user.id },
    });

    return c.json(
      { status: "success", data: { events }, error: null },
      200
    );
  } catch {
    return c.json(
      { status: "fail", error: { message: "Events not found" } },
      500
    );
  }
};

export const getEventById = async (c: Context<AppEnv>) => {
  try {
    // ✅ validate param
    const { id } = idParamSchema.parse({
      id: c.req.param("id"),
    });

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return c.json(
        { status: "fail", error: { message: "Event not found" } },
        404
      );
    }

    return c.json(
      { status: "success", data: { event }, error: null },
      200
    );
  } catch (error) {
    return c.json(
      { status: "fail", error: { message: getErrorMessage(error) } },
      400
    );
  }
};

export const updateEvent = async (c: Context<AppEnv>) => {
  try {
    const { id } = idParamSchema.parse({
      id: c.req.param("id"),
    });

    const user = c.get("user");

    if (!user) {
      return c.json(
        { status: "fail", error: { message: "Unauthorized" } },
        401
      );
    }

    const existing = await prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      return c.json(
        { status: "fail", error: { message: "Event not found" } },
        404
      );
    }

    if (existing.organizer_id !== user.id) {
      return c.json(
        { status: "fail", error: { message: "Forbidden" } },
        403
      );
    }

    const body = updateEventSchema.parse(await c.req.json());

    const nextDateTime =
      body.date && body.time
        ? new Date(`${body.date}T${body.time}`)
        : existing.date_time;

    const nextTotal =
      body.total_tickets ?? existing.total_tickets;

    const alreadyBooked =
      (existing.total_tickets ?? 0) -
      (existing.available_tickets ?? 0);

    const nextAvailable = Math.max(
      nextTotal - alreadyBooked,
      0
    );

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...body,
        date_time: nextDateTime,
        total_tickets: nextTotal,
        available_tickets: nextAvailable,
      },
    });

    return c.json(
      {
        status: "success",
        data: { event, message: "Event updated successfully" },
        error: null,
      },
      200
    );
  } catch (error) {
    return c.json(
      { status: "fail", error: { message: getErrorMessage(error) } },
      400
    );
  }
};

export const cancelEvent = async (c: Context<AppEnv>) => {
  try {
    const { id } = idParamSchema.parse({
      id: c.req.param("id"),
    });

    const user = c.get("user");

    if (!user) {
      return c.json(
        { status: "fail", error: { message: "Unauthorized" } },
        401
      );
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return c.json(
        { status: "fail", error: { message: "Event not found" } },
        404
      );
    }

    if (event.status === "CANCELLED") {
      return c.json(
        {
          status: "fail",
          error: { message: "Event is already cancelled" },
        },
        400
      );
    }

    if (event.organizer_id !== user.id) {
      return c.json(
        { status: "fail", error: { message: "Not allowed" } },
        403
      );
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelled_at: new Date(),
      },
    });

    return c.json(
      {
        status: "success",
        data: { message: "Event cancelled", event: updated },
        error: null,
      },
      200
    );
  } catch (error) {
    return c.json(
      { status: "fail", error: { message: getErrorMessage(error) } },
      400
    );
  }
};