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
    <div className="w-full bg-white border border-gray-200 p-4 md:p-6 rounded-xl flex flex-col justify-between">
      <div className="space-y-3 text-gray-800">
        <p className="flex gap-2">
          <span className="shrink-0">📍</span>
          <span className="min-w-0 break-words">{event.location}</span>
        </p >
        <p className="flex gap-2">
          <span className="shrink-0">📅</span>
          <span>{formattedDate}</span>
        </p>
        <p className="flex gap-2">
          <span className="shrink-0">🕒</span>
          <span>{formattedTime}</span>
        </p>
        <p className="flex gap-2">
          <span className="shrink-0">🎟️</span>
          <span>{event.available_tickets} seats left</span>
        </p>
      </div>
      
        <button
          onClick={onBook}
          className="mt-6 border-2 border-green-500 text-green-700 py-2 rounded-full hover:bg-green-50 transition w-full"
        >
          Book Now
        </button>
      
    </div>
  );
}
