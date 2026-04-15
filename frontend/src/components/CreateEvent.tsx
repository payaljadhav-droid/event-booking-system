import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");          
  const [time, setTime] = useState("");          
  const [image, setImage] = useState("");        
  const [total_tickets, setTotalTickets] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !location || !date || !time || !total_tickets) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      
      const date_time = `${date}T${time}`;

      const res = await fetch("http://localhost:3000/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
            description,
            location,
            date,              
            time,              
            total_tickets: Number(total_tickets), 
            image_url: image,  
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Event created successfully!");
        navigate("/create-event", { replace: true });
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
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-500"
          } text-white py-2 rounded-lg`}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}