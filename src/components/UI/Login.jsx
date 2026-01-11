import React, { useState } from "react";
import Spline from "@splinetool/react-spline";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    password === "test@123"
      ? alert(`Welcome ${username}`)
      : alert("Wrong password");
  };

  return (
    <div className=" min-h-screen flex items-center justify-center bg-gray-950">
      <div className="rotating-border">
      <div className=" flex bg-white rounded-xl shadow-xl overflow-hidden w-[720px]">

        {/* 🤖 ROBOT (SHARP, NO SCALE) */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
          <div className="w-full h-[380px] ">
            <Spline scene="https://prod.spline.design/6f40WYJ0nflN1xQd/scene.splinecode" />
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        </div>
</div>
      </div>
    </div>
  );
};

export default Login;
