import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrUpdateEventSchema,
  getEventResponseSchema,
} from "../schemas/event.schema";
import { aiDraftResponseSchema, aiHintSchema } from "../schemas/ai.schema";
import { apiBaseUrl } from "../config/api";

type Props = {
  mode?: "create" | "edit";
};

export default function CreateEvent({ mode = "create" }: Props) {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showAiStep, setShowAiStep] = useState(mode === "create");
  const [hint, setHint] = useState("");
  const [hintError, setHintError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState("");
  const [total_tickets, setTotalTickets] = useState("");

  
  const { data, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/api/events/${id}`, {
        credentials: "include",
      });
      const json = await res.json();
      const parsed = getEventResponseSchema.safeParse(json);
      if (parsed.success) return parsed.data.data.event;
      return json.data?.event ?? json;
    },
    enabled: mode === "edit" && !!id,
  });

  
  useEffect(() => {
    if (data) {
      setTitle(data.title || "");
      setDescription(data.description || "");
      setEventLocation(data.location || "");
      setImage(data.image_url || "");
      setTotalTickets(String(data.total_tickets ?? ""));

      const dt = data.date_time ? new Date(data.date_time) : null;
      if (dt && !Number.isNaN(dt.getTime())) {
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, "0");
        const dd = String(dt.getDate()).padStart(2, "0");
        setDate(`${yyyy}-${mm}-${dd}`);

        const hh = String(dt.getHours()).padStart(2, "0");
        const min = String(dt.getMinutes()).padStart(2, "0");
        setTime(`${hh}:${min}`);
      } else {
        setDate("");
        setTime("");
      }
    }
  }, [data]);

  const aiDraftMutation = useMutation({
    mutationFn: async () => {
      const parsedHint = aiHintSchema.safeParse({ hint });
      if (!parsedHint.success) {
        throw new Error(parsedHint.error.issues[0]?.message ?? "Invalid hint");
      }

      const res = await fetch(`${apiBaseUrl}/api/ai/event-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(parsedHint.data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || json?.message || "AI generation failed");

      const parsed = aiDraftResponseSchema.safeParse(json);
      if (!parsed.success) throw new Error("AI response was not in expected format");

      return parsed.data.data.draft;
    },
    onSuccess: (draft) => {
      setTitle(draft.title ?? "");
      setDescription(draft.description ?? "");
      setEventLocation(draft.location ?? "");
      setDate(draft.date ?? "");
      setTime(draft.time ?? "");
      setTotalTickets(String(draft.total_tickets ?? ""));
      setHintError(null);
      setShowAiStep(false);
    },
    onError: (err: any) => {
      setHintError(err?.message ?? "AI generation failed");
    },
  });

  
  const mutation = useMutation({
    mutationFn: async () => {
      const url =
        mode === "edit"
          ? `${apiBaseUrl}/api/events/${id}`
          : `${apiBaseUrl}/api/events`;

      const method = mode === "edit" ? "PUT" : "POST";

      const parsedInput = createOrUpdateEventSchema.safeParse({
        title,
        description,
        location: eventLocation,
        date,
        time,
        total_tickets,
        image_url: image,
      });
      if (!parsedInput.success) {
        throw new Error(parsedInput.error.issues[0]?.message ?? "Invalid input");
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(parsedInput.data),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      return data;
    },

    onSuccess: () => {
      alert(mode === "edit" ? "Event updated!" : "Event created!");

      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["myEvents"] });

      navigate("/organizer/events");
    },

    onError: (err: any) => {
      alert(err.message);
    },
  });

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate();
  };

  
  if (mode === "edit" && isLoading) {
    return <p className="text-center mt-10">Loading event...</p>;
  }

  return (
    <>
      {mode === "create" && showAiStep ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">Generate event details with AI</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter event idea or hint (e.g. Holi party, Summer fest, DJ night, Tech meetup)
            </p>

            <div className="mt-4">
              <input
                type="text"
                value={hint}
                onChange={(e) => {
                  setHint(e.target.value);
                  setHintError(null);
                }}
                placeholder="Type your hint..."
                className="w-full rounded-lg border p-2"
              />
              {hintError ? <p className="mt-2 text-sm text-red-600">{hintError}</p> : null}
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-lg border px-4 py-2"
                onClick={() => {
                  setHintError(null);
                  setShowAiStep(false);
                }}
                disabled={aiDraftMutation.isPending}
              >
                Skip and fill manually
              </button>
              <button
                type="button"
                className={`rounded-lg px-4 py-2 text-white ${aiDraftMutation.isPending ? "bg-gray-400" : "bg-blue-600"
                  }`}
                onClick={() => aiDraftMutation.mutate()}
                disabled={aiDraftMutation.isPending}
              >
                {aiDraftMutation.isPending ? "Generating..." : "Generate with AI"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === "edit" ? "Edit Event" : "Create Your Event"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Total tickets"
            value={total_tickets}
            onChange={(e) => setTotalTickets(e.target.value)}
            className="w-full p-2 border rounded-lg"
            min={1}
          />

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`w-full ${mutation.isPending ? "bg-gray-400" : "bg-blue-500"
              } text-white py-2 rounded-lg`}
          >
            {mutation.isPending
              ? mode === "edit"
                ? "Updating..."
                : "Creating..."
              : mode === "edit"
                ? "Save Updates"
                : "Create Event"}
          </button>
        </form>
      </div>
    </>
  );
}