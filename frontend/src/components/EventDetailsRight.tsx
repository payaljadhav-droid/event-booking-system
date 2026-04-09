import type { Event } from "../types/Event";

type Props = {
  event: Event;
  onBook: () => void;
};

export default function EventDetailsRight({ event, onBook }: Props) {
  const formattedDate = new Date(event.date_time).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  const formattedTime = new Date(event.date_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-80 bg-gray-100 p-6 rounded-lg flex flex-col justify-between">
      <div className="space-y-4">
        <p>📍 {event.location}</p>
        <p>📅 {formattedDate}</p>
        <p>🕒 {formattedTime}</p>
        <p>🎟️ {event.available_tickets} seats left</p>
      </div>

      <button
        onClick={onBook}
        className="mt-6 border-2 border-green-500 text-green-600 py-2 rounded-full hover:bg-green-100 transition"
      >
        Book Now
      </button>
    </div>
  );
}