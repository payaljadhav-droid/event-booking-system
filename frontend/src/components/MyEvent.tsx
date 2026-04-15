import { useQuery } from "@tanstack/react-query";

type Event = {
  id: string;
  title: string;
  date_time: string;
  image_url?: string;
  location: string;
  total_tickets: number;
  available_tickets: number;
};

export default function MyEvents() {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ["myEvents"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/events/mine", {
        credentials: "include",
      });

      const data = await res.json();
      return data.data.events;
    },
  });

  if (isLoading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events</p>;

  return (
    <div className="p-8">

      {events?.length === 0 ? (
        <p>No events created</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => {
            const dateObj = new Date(event.date_time);

            const formattedDate = dateObj.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            });

            const formattedTime = dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={event.id}
                className="rounded-xl overflow-hidden shadow-lg bg-white"
              >
                <img
                  src={
                    event.image_url ||
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                  }
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {formattedDate} | {formattedTime}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    📍 {event.location}
                  </p>
                  <p className="text-sm mt-2">
                    🎟 {event.available_tickets}/{event.total_tickets} available
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}