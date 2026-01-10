"use client";
import React, { useState } from "react";
import Layout from "@/components/Layout";
import DepartmentAnalytics from "@/components/DepartmentAnalytics";
import OverallAnalytics from "@/components/OverallAnalytics";

export default function AttendancePage() {
    const [activeTab, setActiveTab] = useState("overall");

    const TabButton = ({ tabName, label, isActive }) => {
        const baseClasses =
            "px-6 py-3 text-lg font-medium rounded-t-lg transition-all duration-300 ease-in-out cursor-pointer focus:outline-none";
        const activeClasses =
            "text-indigo-600 border-b-4 border-indigo-600 bg-white shadow-md";
        const inactiveClasses =
            "text-gray-500 border-b-4 border-transparent hover:bg-gray-100 hover:text-gray-700";

        return (
            <button
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses
                    }`}
                onClick={() => setActiveTab(tabName)}
            >
                {label}
            </button>
        );
    };

    return (
        <Layout>
            <div className="max-w-fit md:ml-16  bg-gray-50 min-h-screen justify-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
                    Attendance Dashboard
                </h1>

                <div className="flex justify-start border-b border-gray-200 mb-8 space-x-2">
                    <TabButton
                        tabName="department"
                        label="Department Wise Analytics"
                        isActive={activeTab === "department"}
                    />
                    <TabButton
                        tabName="overall"
                        label="Overall Attendance Analytics"
                        isActive={activeTab === "overall"}
                    />
                </div>

                {/* --- Tab Content --- */}
                <div className="mt-6">
                    {activeTab === "department" && <DepartmentAnalytics />}
                    {activeTab === "overall" && <OverallAnalytics />}
                </div>
            </div>
        </Layout>
    );
}
