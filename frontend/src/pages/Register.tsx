import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  
  const navigate = useNavigate();
  
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!name && !email && !password && !role) return;
    
      try {
        const res = await fetch("http://localhost:8080/auth/registerUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
          body: JSON.stringify({ name, email, password, role }),
        });
    
        const data = await res.json();
    
        if (res.ok) {
          console.log("User register successful", data);
          navigate("/"); 
        } else {
          
          console.log("registration failed:", data.message);
          alert(data.message || "Registration failed");
        }
      } catch (err) {
        console.error("Error registering in:", err);
      }
    }; 
  

  return (
    <>
       <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"> 
        <h1 className="text-2xl font-bold text-center mb-6"> Kindly Fill in this form to register </h1>
        <div className="space-y-4 flex justify-center">
          <form onSubmit={handleRegister}>
            <div className="input-box">
              <input 
                type="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-80 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
            </div>
            <div className="input-box">
              <input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-80 mt-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="input-box">
                <input 
                  type="password"
                  placeholder="Set your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-80 mt-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              </div>
              <div className="input-box">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-80 mt-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select your role</option>
                  <option value="user">User</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>
              <div className="flex flex-col justify-center items-center">
              <button type="submit"
              className="w-64 mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              Sign Up
                </button>
                <p className="mt-2">
                  Already have an account? 
                  <a href="/" className="text-blue-500 hover:underline ml-1">Sign In</a>
                </p>
              </div>
            </form>
            
          </div>
          
        </div>
        
      </div>
      
    </>
  )
};