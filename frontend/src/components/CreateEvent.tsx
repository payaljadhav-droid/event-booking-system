import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date_time, setDateTime] = useState("");
  const [total_tickets, setTotalTickets] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !location || !date_time || !total_tickets) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/event/createEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description, location, date_time, total_tickets }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Event created successfully!");
        navigate("/create-event");
      } else {
        alert(data.message || "Failed to create event");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Event Name:</label>
          <input
            type="text"
            placeholder="Enter event name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description:</label>
          <textarea
            placeholder="Enter event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={4}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location:</label>
          <input
            type="text"
            placeholder="Enter event location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Date:</label>
          <input
            type="date"
            value={date_time}
            onChange={(e) => setDateTime(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Total Tickets:</label>
          <input
            type="number"
            placeholder="Enter number of tickets"
            value={total_tickets}
            onChange={(e) => setTotalTickets(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            min={1}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold py-2 rounded-lg transition`}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}