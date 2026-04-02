import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
       <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"> 
        <h1 className="text-2xl font-bold text-center mb-6"> Login </h1>
        <div className="space-y-4 flex justify-center">
          <form>
            <div className="input-box">
              <input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-80 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
            </div>
            <div className="input-box">
              <input 
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-80 mt-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col justify-center items-center">
              <button type="submit"
              className="w-64 mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              signIn
                </button>
                <p>Don't have an account? SignUp</p>
              </div>
            </form>
            
          </div>
          
        </div>
        
      </div>
      
    </>
  )
};