import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data); 

      if (!res.ok) {
        alert(data?.error?.message || "Login failed");
        return;
      }

      const user = data?.data?.user;

      if (!user || !user.role) {
        console.error("User role missing in response:", data);
        alert("Login failed: invalid user data");
        return;
      }

      const role = (user.role || "").toUpperCase();

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          role: role,
          name : user.name,
        })
      );

      console.log("Stored user:", { id: user.id, role }); 

      navigate("/user-dashboard");
      
    } catch (err) {
      console.error("Error logging in:", err);
      alert("Login failed: network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form
          onSubmit={handleLogin}
          className="space-y-4 flex flex-col items-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-80 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-80 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-64 mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign In
          </button>
          <p className="mt-2">
            Don't have an account?
            <a href="/register" className="text-blue-500 hover:underline ml-1">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}