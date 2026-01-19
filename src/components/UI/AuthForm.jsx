"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Spline from "@splinetool/react-spline";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Building, 
} from "lucide-react";

export default function AuthForm() {
  const router = useRouter();

  // Toggle State
  const [mode, setMode] = useState("login");
  const isLogin = mode === "login";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setMode(isLogin ? "signup" : "login");
    // Reset form
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "",
      department: "",
    });
    setShowPassword(false);
  };

  // Backend Logic (From Logic Code)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        
        const res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.error) {
          alert("Invalid email or password");
        } else {
          router.push("/dashboard");
        }
      } else {
        // ✅ SIGNUP (API)
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            department: formData.department,
          }),
        });

        if (!res.ok) {
          const msg = await res.text();
          alert(msg);
        } else {
          alert("Account created! Please login.");
          toggleMode();
        }
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl min-h-[600px] transition-all duration-500">

        {/* LEFT SECTION: FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">

          {/* Branding */}
          <div className="mb-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <img
                src="/jspm1.webp"
                alt="JSPM Logo"
                className="h-10 w-10 object-contain"
                onError={(e) => (e.target.style.display = "none")}
              />
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                JSPM NTC
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              Attendance Monitoring System
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLogin ? "Welcome Back" : "Get Started"}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLogin
                ? "Please enter your details to sign in."
                : "Create your account to manage attendance."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
         
            {!isLogin && (
              <>
                {/* Role Selection */}
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    name="role"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 appearance-none transition-all"
                    onChange={handleChange}
                    value={formData.role}
                  >
                    <option value="">Select Role</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Department Dean">Department Dean</option>
                  </select>
                </div>

                {/* Username Input */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400 text-gray-800"
                    onChange={handleChange}
                    value={formData.username}
                  />
                </div>

                {/* Department Input (Added to match Logic) */}
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="department"
                    placeholder="Department (e.g. CSE)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400 text-gray-800"
                    onChange={handleChange}
                    value={formData.department}
                  />
                </div>
              </>
            )}

            {/* EMAIL (Both Modes) */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                placeholder="College Email Address"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400 text-gray-800"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </div>

            {/* PASSWORD (Both Modes) */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={isLogin ? "Password" : "Create Password"}
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400 text-gray-800"
                onChange={handleChange}
                value={formData.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password Link (Login Only) */}
            {isLogin && (
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />{" "}
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Sign Up"}
                  {isLogin ? (
                    <LogIn className="h-5 w-5" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="text-blue-600 font-semibold hover:underline focus:outline-none"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </div>
        </div>

        {/* RIGHT SECTION: VISUALS */}
        <div className="hidden md:flex w-1/2 bg-gray-900 relative items-center justify-center overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-full h-[365px] relative z-10">
            <Spline
              className="w-full h-full"
              scene="https://prod.spline.design/6f40WYJ0nflN1xQd/scene.splinecode"
            />
          </div>

          <div className="absolute bottom-10 left-0 right-0 text-center z-20 px-6">
            <h3 className="text-white text-xl font-bold mb-2">
              Smart Monitoring
            </h3>
            <p className="text-gray-400 text-sm">
              Real-time attendance tracking for the modern campus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}