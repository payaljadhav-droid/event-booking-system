import { useNavigate } from "react-router-dom";

type Props = {
  event: {
    id: string;
    title: string;
    date_time: string;
    image_url?: string;
    location?: string;
  };
};

export default function EventCard({ event }: Props) {
  const navigate = useNavigate();

  const formattedDate = new Date(event.date_time).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="cursor-pointer w-64"
    >
      
      <div
        className="relative h-52 rounded-xl overflow-hidden shadow-lg bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            event.image_url && event.image_url.trim() !== ""
              ? event.image_url
              : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
          })`,
        }}
      >
        
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-2 left-2 bg-black text-white text-xs px-3 py-1 rounded-md">
          {formattedDate}
        </div>
      </div>

      <div className="mt-3 px-1">
        <h3 className="text-base font-semibold text-gray-900">
          {event.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {event.location || "Location not specified"}
        </p>
      </div>
    </div>
  );
}