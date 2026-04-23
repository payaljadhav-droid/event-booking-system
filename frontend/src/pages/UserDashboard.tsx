import Header from "../components/Header";
import FilterPanel from "../components/FilterPanel";
import EventCard from "../components/EventCards";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { apiBaseUrl } from "../config/api";

type Event = {
  id: string;
  title: string;
  date_time: string;
  image: string;
  location: string; 
};

export default function UserDashboard() {
  const [filter, setFilter] = useState("all");
  const [location, setLocation] = useState(""); 
  const [search, setSearch] = useState("");

  const { data: events = [], isLoading, error } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/api/events`);
      const json = await res.json();
      return json.data.events;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading events</p>;

  function parseDate(dateString: string) {
    const [day, month, year] = dateString.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  
  const filteredEvents = events.filter((event) => {
    const eventDate = parseDate(event.date_time);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let matchesDate = true;
    let matchesLocation = true;

    if (filter === "today") {
      matchesDate =
        eventDate.toDateString() === today.toDateString();
    } else if (filter === "tomorrow") {
      matchesDate =
        eventDate.toDateString() === tomorrow.toDateString();
    } else if (filter === "upcoming") {
      matchesDate = eventDate > tomorrow;
    }
    
    let matchesSearch = true;
    
    if (search.trim() !== "") {
      matchesSearch = event.title
        .toLowerCase()
        .includes(search.toLowerCase());
    }

    if (location.trim() !== "") {
      matchesLocation = event.location
        .toLowerCase()
        .includes(location.toLowerCase());
    }
    
    return matchesDate && matchesLocation && matchesSearch ;
  });
  
  console.log(filteredEvents);

  return (
    <>
      <Header search={search} setSearch={setSearch}/>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Events</h2>

        <div className="flex gap-6 items-start">
          <FilterPanel
            filter={filter}
            setFilter={setFilter}
            location={location}
            setLocation={setLocation}
          />

          <div className="w-3/4">
            <div className="grid grid-cols-3 gap-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event}
                  />
                ))
              ) : (
                <p>No events found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}