import type { Event } from "../types/Event";

type Props = {
  event: Event;
};

export default function EventDetailsLeft({ event }: Props) {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-semibold mb-4">{event.title}</h2>

      <div className="border-2 border-red-300 rounded-lg h-64 flex items-center justify-center mb-6 overflow-hidden">
        <img
          src={`http://localhost:3000/${event.image}`}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">About the Event</h3>
        <hr className="mb-4" />

        <p className="text-gray-600">{event.description}</p>
      </div>
    </div>
  );
}