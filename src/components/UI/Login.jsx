"use client";

import React, { useState } from "react";
import Spline from "@splinetool/react-spline";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");          // ✅ NEW
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUsername = localStorage.getItem("username");
    const savedEmail = localStorage.getItem("email");   // ✅ GET EMAIL
    const savedPassword = localStorage.getItem("password");
    const savedRole = localStorage.getItem("role");

    if (
      username === savedUsername &&
      email === savedEmail &&
      password === savedPassword &&
      role === savedRole
    ) {
      alert(`Welcome ${role} ${username}`);

      if (role === "Faculty") {
        router.push("/dashboard");
      }

      if (role === "Department Dean") {
        router.push("/dashboard");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="rotating-border">
        <div className="flex bg-white rounded-xl shadow-xl overflow-hidden w-[720px]">

          {/* ROBOT */}
          <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
            <div className="w-full h-[380px]">
              <Spline scene="https://prod.spline.design/6f40WYJ0nflN1xQd/scene.splinecode" />
            </div>
          </div>

          {/* LOGIN FORM */}
          <div className="w-full md:w-1/2 p-6">
            <h2 className="text-2xl text-black font-semibold text-center mb-6">
              Login
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">

              <select
                required
                className="w-full text-black px-4 py-2 border rounded-lg"
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="Faculty">Faculty</option>
                <option value="Department Dean">Department Dean</option>
              </select>

              <input
                type="text"
                placeholder="Username"
                required
                className="w-full placeholder-gray-500 text-black px-4 py-2 border rounded-lg"
                onChange={(e) => setUsername(e.target.value)}
              />

              {/* ✅ EMAIL FIELD */}
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full placeholder-gray-500 text-black px-4 py-2 border rounded-lg"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                required
                className="w-full placeholder-gray-500 text-black px-4 py-2 border rounded-lg"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg"
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
