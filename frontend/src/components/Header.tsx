import { useNavigate } from "react-router-dom";

type HeaderProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function Header({ search, setSearch }: HeaderProps) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const name = user.name || "Guest";
  
  return (
    <header className="w-full bg-white shadow-md px-6 py-3" >
      
      <div className="flex items-center justify-between">
         <div className="flex items-center space-x-4">
          
          <div className="text-xl font-bold">
            Eventify
          </div>
          {setSearch && (
            <input
              type="text"
              value={search}
              placeholder="Search for events"
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        </div>
        
        
        <nav className="flex items-center space-x-6 text-gray-700 font-medium">
          {role === "user" ? (
              <span
                onClick={() => navigate("/my-bookings")}
                className="cursor-pointer hover:text-blue-500"
              >
                My Bookings
              </span>
            ) : (
              <span
                onClick={() => navigate("/my-events")}
                className="cursor-pointer hover:text-blue-500"
              >
                My Events
              </span>
            )}   
          <span className="cursor-pointer hover:text-blue-500">Hi,{name}</span>
        </nav>

      </div>
      
    </header>
  );
}