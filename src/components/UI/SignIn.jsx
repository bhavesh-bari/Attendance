"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Spline from "@splinetool/react-spline";

export default function Signup() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");        // ✅ NEW
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (!username || !email || !password || !role) {
      alert("All fields are required");
      return;
    }

    // Store data (frontend demo)
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);        // ✅ SAVE EMAIL
    localStorage.setItem("password", password);
    localStorage.setItem("role", role);

    alert("Signup successful!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">

      {/* CARD */}
      <div className="flex bg-white text-black rounded-xl shadow-xl overflow-hidden w-[720px]">

        {/* LEFT → FORM */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Sign Up
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">

            <select
              required
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="Faculty">Faculty</option>
              <option value="Department Dean">Department Dean</option>
            </select>

            <input
              type="text"
              placeholder="Create Username"
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) => setUsername(e.target.value)}
            />

            {/* ✅ EMAIL INPUT */}
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-4 py-2  border rounded-lg"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Create Password"
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* RIGHT → ROBOT */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
          <div className="w-full h-[380px]">
            <Spline scene="https://prod.spline.design/6f40WYJ0nflN1xQd/scene.splinecode" />
          </div>
        </div>

      </div>
    </div>
  );
}
