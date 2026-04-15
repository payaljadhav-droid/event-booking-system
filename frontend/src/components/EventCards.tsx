import { useNavigate } from "react-router-dom";

type Props = {
  event: {
    id: string;
    title: string;
    date_time: string;
    image_url?: string;
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
      onClick={() => navigate(`/event-details/${event.id}`)}
      className="cursor-pointer relative w-64 h-40 rounded-xl overflow-hidden shadow-lg bg-cover bg-center"
      style={{
        backgroundImage: `url(${
          event.image_url && event.image_url.trim() !== ""
            ? event.image_url
            : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
        })`,
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute top-2 left-3 text-white font-bold text-lg">
        {event.title}
      </div>

      <div className="absolute bottom-2 left-3 text-white text-sm">
        {formattedDate}
      </div>
    </div>
  );
}