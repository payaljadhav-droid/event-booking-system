import EventDetailsLeft from "../components/EventDetailsLeft";
import EventDetailsRight from "../components/EventDetailsRight";
import EventBooking from "../components/EventBooking";
import Header from "../components/Header";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { apiBaseUrl } from "../config/api";

export default function EventDetailsPage() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const { id } = useParams();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/api/events/${id}`);
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

      <div className="px-4 md:px-8 lg:px-16 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-6">
            <div className="lg:col-span-8">
              <EventDetailsLeft event={event} />
            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-6">
              <EventDetailsRight
                event={event}
                onBook={() => setOpenModal(true)}
              />
            </div>
          </div>
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