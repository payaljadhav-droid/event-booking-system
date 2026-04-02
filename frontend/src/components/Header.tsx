export default function Header() {
  return (
    <header className="w-full bg-white shadow-md px-6 py-3" >
      
      <div className="flex items-center justify-between">
         <div className="flex items-center space-x-4">
          
          <div className="text-xl font-bold">
            Eventify
          </div>

          <input
            type="text"
            placeholder="Search for events"
            className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* RIGHT SIDE */}
        <nav className="flex items-center space-x-6 text-gray-700 font-medium">
          <span className="cursor-pointer hover:text-blue-500">Events</span>
          <span className="cursor-pointer hover:text-blue-500">Bookings</span>
          <span className="cursor-pointer hover:text-blue-500">Hi, Guest</span>
        </nav>

      </div>
      
    </header>
  );
}