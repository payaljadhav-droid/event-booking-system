import { useState } from "react";

type Props = {
  filter: string;
  setFilter: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
};

export default function FilterPanel({setFilter, location, setLocation}:Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [locationOpen, setLocationOpen] = useState<boolean>(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setLocationOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen  p-2 gap-6">
      
      <div className="w-72 bg-white rounded-2xl shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        <div className="relative w-full mb-4">
          <div
            onClick={() => setOpen(!open)}
            className="flex justify-between items-center border px-4 py-2 rounded-lg cursor-pointer bg-white"
          >
            <span className="text-gray-700">Date</span>
            <span className="text-lg">{open ? "⌃" : "⌄"}</span>
          </div>

          {open && (
            <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-md z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setFilter("today")}>
                Today
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100"onClick={() => setFilter("tomorrow")}>
                Tomorrow
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setFilter("Upcoming")}>
                Upcoming
              </button>
            </div>
          )}
        </div>
        
        <div className="relative w-full">
          <div
            onClick={() => setLocationOpen(!locationOpen)}
            className="flex justify-between items-center border px-4 py-2 rounded-lg cursor-pointer bg-white"
          >
            <span className="text-gray-700">
              {location || "Location"}
            </span>
            <span className="text-lg">
              {locationOpen ? "⌃" : "⌄"}
            </span>
          </div>

          {locationOpen && (
            <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-md p-3 z-10">
              <input
                type="text"
                placeholder="Enter city..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
            </div>
          )}
        </div>
        {role == "organizer" ? (
          <div className="mt-20">
            <a href="/create-event" className="text-blue-500 hover:underline">
            Create your event
            </a>
          </div>
        ) : (null)}
      </div>
    </div>
  );
}