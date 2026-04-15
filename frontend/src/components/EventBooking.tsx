import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  event_id: string;
};

export default function EventBooking({ isOpen, onClose, event_id }: Props) {
  const [tickets, setTickets] = useState("");
  const [success, setSuccess] = useState(false);

  const handleBooking = async () => {
    if (!tickets) return alert("Enter number of tickets");

    try {
      const res = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: event_id,
          tickets_booked: Number(tickets),
        }),
      });

      const data = await res.json();
      console.log("BOOKING RESPONSE:", data);

      if (res.ok) {
        setSuccess(true);
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#eaeaea] w-400px min-h-250px p-8 rounded-xl shadow-lg relative flex flex-col items-center justify-center text-center">

      
        <button
          onClick={() => {
            onClose();
            setSuccess(false);
            setTickets("");
          }}
           className="absolute mb-6 top-3 right-3 text-2xl font-bold text-gray-600 transition"
          >
            ×
        </button>

        {!success ? (
          <div className="flex flex-col items-center gap-6">

            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium">
                Number of tickets:
              </h2>

              <input
                type="number"
                value={tickets}
                onChange={(e) => setTickets(e.target.value)}
                className="border-2 border-black px-2 py-1 rounded w-20 outline-none"
              />
            </div>

            <button
              onClick={handleBooking}
              className="border-2 border-green-600 text-green-600 py-2 px-6 rounded-full font-semibold hover:bg-green-100 transition"
            >
              Confirm Booking
            </button>

          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 mt-4">

            <h2 className="text-lg font-semibold">
              Booking Successful!!!!!
              </h2>
              
            <a href="/bookings/me" className="text-sm text-gray-500 cursor-pointer hover:underline">View details</a>

          </div>
        )}
      </div>
    </div>
  );
}