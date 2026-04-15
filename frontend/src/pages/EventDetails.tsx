import EventDetailsLeft from "../components/EventDetailsLeft";
import EventDetailsRight from "../components/EventDetailsRight";
import EventBooking from "../components/EventBooking";
import Header from "../components/Header";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function EventDetailsPage() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const { id } = useParams();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/event/${id}`);
      const json = await res.json();
      return json.data.event;
    },
    enabled: !!id,
  });

  if (isLoading) return <p>Loading event...</p>;
  if (error) return <p>Error loading event</p>;
  if (!event) return <p>No event found</p>;

  return (
    <>
      <Header search={search} setSearch={setSearch} />

      <div className="p-6 rounded-xl">
        <div className="flex gap-6">
          <EventDetailsLeft event={event} />

          <EventDetailsRight
            event={event}
            onBook={() => setOpenModal(true)}
          />
        </div>
      </div>

      <EventBooking
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        event_id={event.id}
      />
    </>
  );
}