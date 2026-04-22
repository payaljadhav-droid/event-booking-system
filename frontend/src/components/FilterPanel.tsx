import { useEffect, useRef, useState } from "react";

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
  const role = (user.role || "").toString().toLowerCase();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        setOpen(false);
        setLocationOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setLocationOpen(false);
    }
  };

  return (
    <div className="p-2">
      <div
        ref={rootRef}
        className="w-72 bg-white rounded-2xl shadow-md p-5 border border-gray-100"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Filters</h2>

        <div className="relative w-full mb-4">
          <button
            type="button"
            onClick={() => {
              setOpen((v) => !v);
              setLocationOpen(false);
            }}
            className="w-full flex justify-between items-center border border-gray-200 px-4 py-2 rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition"
          >
            <span className="text-gray-800 font-medium">Date</span>
            <span className="text-lg text-gray-600">{open ? "⌃" : "⌄"}</span>
          </button>

          {open && (
            <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-800"
                onClick={() => {
                  setFilter("today");
                  setOpen(false);
                }}
              >
                Today
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-800"
                onClick={() => {
                  setFilter("tomorrow");
                  setOpen(false);
                }}
              >
                Tomorrow
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-800"
                onClick={() => {
                  setFilter("upcoming");
                  setOpen(false);
                }}
              >
                Upcoming
              </button>
            </div>
          )}
        </div>
        
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => {
              setLocationOpen((v) => !v);
              setOpen(false);
            }}
            className="w-full flex justify-between items-center border border-gray-200 px-4 py-2 rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition"
          >
            <span className="text-gray-800 font-medium truncate">
              {location || "Location"}
            </span>
            <span className="text-lg text-gray-600">
              {locationOpen ? "⌃" : "⌄"}
            </span>
          </button>

          {locationOpen && (
            <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10">
              <input
                type="text"
                placeholder="Enter city..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
            </div>
          )}
        </div>
        {role === "organizer" ? (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <a
              href="/organizer/events/new"
              className="inline-flex w-full justify-center px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Create your event
            </a>
          </div>
        ) : (null)}
      </div>
    </div>
  );
}