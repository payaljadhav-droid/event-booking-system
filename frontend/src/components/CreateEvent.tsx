import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  mode?: "create" | "edit";
};

export default function CreateEvent({ mode = "create" }: Props) {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      const res = await fetch(`http://localhost:3000/api/events/${id}`, {
        credentials: "include",
      });
      const json = await res.json();
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

  
  const mutation = useMutation({
    mutationFn: async () => {
      const url =
        mode === "edit"
          ? `http://localhost:3000/api/events/${id}`
          : "http://localhost:3000/api/events";

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          location: eventLocation,
          date,
          time,
          total_tickets: Number(total_tickets),
          image_url: image,
        }),
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

    if (!title || !description || !eventLocation || !date || !time || !total_tickets) {
      alert("Please fill in all fields");
      return;
    }

    mutation.mutate();
  };

  
  if (mode === "edit" && isLoading) {
    return <p className="text-center mt-10">Loading event...</p>;
  }

  return (
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
  );
}