import type { Event } from "../types/Event";

type Props = {
  event: Event;
};

export default function EventDetailsLeft({ event }: Props) {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
        {event.title}
      </h2>

      <div className="mt-4 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 h-56 sm:h-72 md:h-80 lg:h-[420px]">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900">About the Event</h3>
        <hr className="my-4" />

        <p className="text-gray-600">{event.description}</p>
      </div>
    </div>
  );
}