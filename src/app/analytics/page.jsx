"use client";
import React, { useState } from "react";
import Layout from "@/components/Layout";
import DepartmentAnalytics from "@/components/DepartmentAnalytics";
import OverallAnalytics from "@/components/OverallAnalytics";

export default function AttendancePage() {
    const [activeTab, setActiveTab] = useState("overall");

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 lg:p-12">
                {/* Header Section */}
                <header className="max-w-7xl mx-auto mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                Attendance Analytics
                            </h1>
                            <p className="text-slate-500 mt-1">
                                Monitor and analyze attendance at Institute level and Departmental level.
                            </p>
                        </div>

                        {/* Realistic Segmented Control (Tabs) */}
                        <div className="inline-flex p-1 bg-slate-200/50 rounded-xl backdrop-blur-sm">
                            <button
                                onClick={() => setActiveTab("overall")}
                                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "overall"
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                Overall View
                            </button>
                            <button
                                onClick={() => setActiveTab("department")}
                                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "department"
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                Departmental
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[60vh]">
                        <div className="p-6 md:p-8">
                            {/* Animation wrapper could be added here */}
                            {activeTab === "overall" ? (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <OverallAnalytics />
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <DepartmentAnalytics />
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </Layout>
    );
}