import { Context } from "hono";
import { z } from "zod";
import { AppEnv } from "./authService";
import { eventUpsertSchema } from "../schemas/event.schema";

const openRouterResponseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          content: z.string(),
        }),
      })
    )
    .min(1),
});

const generateBodySchema = z.object({
  hint: z.string().min(3, "Hint is too short").max(500, "Hint is too long"),
});

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenceMatch?.[1]?.trim() ?? trimmed;

  const firstObjectMatch = candidate.match(/\{[\s\S]*\}/);
  const jsonText = firstObjectMatch?.[0] ?? candidate;

  return JSON.parse(jsonText);
}

export const generateEventDraft = async (c: Context<AppEnv>) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return c.json(
        {
          status: "fail",
          error: { message: "Server missing OPENROUTER_API_KEY" },
        },
        500
      );
    }

    const body = generateBodySchema.parse(await c.req.json());

    const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

    const system = [
      "You generate event draft data for an event booking app.",
      'Return ONLY valid JSON (no markdown) matching this exact shape:',
      '{"title":"","description":"","location":"","date":"","time":"","total_tickets":0}',
      "Constraints:",
      '- date must be "YYYY-MM-DD"',
      '- time must be "HH:mm" (24h)',
      "- total_tickets must be an integer >= 1",
      "Keep it realistic and concise.",
    ].join("\n");

    const userPrompt = [
      `Event idea/hint: ${body.hint}`,
      "Generate a compelling title, a short description, a plausible location (city/venue),",
      "and a near-future date/time. Choose a reasonable ticket count.",
    ].join("\n");

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "event-booking-system",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    const raw = await res.json().catch(() => null);
    if (!res.ok) {
      const msg =
        (raw && (raw.error?.message || raw.message)) ||
        `OpenRouter error (${res.status})`;
      return c.json(
        {
          status: "fail",
          error: { message: msg },
        },
        502
      );
    }

    const parsed = openRouterResponseSchema.safeParse(raw);
    if (!parsed.success) {
      return c.json(
        {
          status: "fail",
          error: { message: "Invalid response from OpenRouter" },
        },
        502
      );
    }

    const content = parsed.data.choices[0]?.message?.content ?? "";
    const obj = extractJsonObject(content);

    const draft = eventUpsertSchema
      .pick({
        title: true,
        description: true,
        location: true,
        date: true,
        time: true,
        total_tickets: true,
      })
      .parse(obj);

    return c.json(
      {
        status: "success",
        data: { draft },
        error: null,
      },
      200
    );
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.issues?.[0]?.message || "Invalid input"
        : error instanceof Error
          ? error.message
          : "Something went wrong";

    return c.json(
      {
        status: "fail",
        error: { message },
      },
      400
    );
  }
};

