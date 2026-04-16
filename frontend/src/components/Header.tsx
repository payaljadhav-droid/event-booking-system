import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

type HeaderProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function Header({ search, setSearch }: HeaderProps) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  console.log("USER OBJECT:", user);
  console.log("ROLE:", role);
  const name = user.name || "Guest";

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-md px-6 py-3">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center space-x-4">
          <div
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
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
          
          
          {role === "USER" ? (
            <span
              onClick={() => navigate("/bookings/me")}
              className="cursor-pointer hover:text-blue-500"
            >
              My Bookings
            </span>
          ) : (
            <span
              onClick={() => navigate("/organizer/events")}
              className="cursor-pointer hover:text-blue-500"
            >
              My Events
            </span>
          )}

          <div className="relative" ref={menuRef}>
            <span
              onClick={() => setOpenMenu(!openMenu)}
              className="cursor-pointer hover:text-blue-500"
            >
              Hi, {name}
            </span>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">

              <div className="px-4 py-3 border-b bg-gray-50">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            
              <div>
            
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-500 transition"
                >
                  Logout
                </button>
              </div>
            
            </div>
            )}
          </div>

        </nav>
      </div>
    </header>
  );
}