import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Booking = {
  id: string;
  tickets_booked: number;
  event: {
    title: string;
    date_time: string;
    image?: string;
  };
};

export default function MyBookings() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const { data: bookings, isLoading, error } = useQuery<Booking[]>({
    queryKey: ["myBookings"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/book/my", {
        credentials: "include",
      });

      const data = await res.json();
      return data.data.bookings;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (booking_id: string) => {
      const res = await fetch("http://localhost:3000/book/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ booking_id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Cancel failed");
      }

      return data;
    },

    onSuccess: (_, booking_id) => {
      queryClient.setQueryData(["myBookings"], (old: Booking[] = []) =>
        old.filter((b) => b.id !== booking_id)
      );

      setMessage("Booking cancelled successfully!");
      setTimeout(() => setMessage(""), 3000);
    },

    onError: (err: any) => {
      setMessage(err?.message || "Cancel failed");
      setTimeout(() => setMessage(""), 3000);
    },
  });

  if (isLoading) return <p>Loading bookings...</p>;
  if (error) return <p>Error loading bookings</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {bookings?.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          bookings?.map((booking) => {
            const event = booking.event;

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
                key={booking.id}
                className="border-2 border-gray-300 rounded-xl p-5 flex justify-between items-center shadow-sm"
              >
                <div className="flex gap-6 items-center">
                  <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={
                        event?.image
                          ? `http://localhost:3000/${event.image}`
                          : "/placeholder.png"
                      }
                      alt={event?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {event?.title}
                    </h3>
                    <p className="text-gray-600">
                      {formattedDate} | {formattedTime}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tickets: {booking.tickets_booked}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const confirmCancel = window.confirm(
                      "Are you sure you want to cancel this booking?"
                    );
                    if (confirmCancel) {
                      cancelMutation.mutate(booking.id);
                    }
                  }}
                  disabled={cancelMutation.isPending}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  {cancelMutation.isPending
                    ? "Cancelling..."
                    : "Cancel Booking"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}