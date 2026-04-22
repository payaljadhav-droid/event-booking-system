import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "../schemas/auth.schema";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  
  const navigate = useNavigate();
  
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const parsed = registerSchema.safeParse({ name, email, password, role });
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    
      try {
        const res = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
          body: JSON.stringify(parsed.data),
        });
    
        const data = await res.json();
    
        if (res.ok) {
          console.log("User register successful", data);
          alert("User registered successfully");
          navigate("/login"); 
        } else {
          
          const message =
            data?.error?.message || data?.message || "Registration failed";
          console.log("registration failed:", message);
          alert(message);
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
                  <option value="user">user</option>
                  <option value="organizer">organizer</option>
                </select>
              </div>
              <div className="flex flex-col justify-center items-center">
              <button type="submit"
              className="w-64 mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              Sign Up
                </button>
                <p className="mt-2">
                  Already have an account? 
                  <a href="/login" className="text-blue-500 hover:underline ml-1">Sign In</a>
                </p>
              </div>
            </form>
            
          </div>
          
        </div>
        
      </div>
      
    </>
  )
};