"use client";
import React from "react";
import DepartmentComparison from "@/components/UI/analytics/DepartmentComparison";
import DepartmentAttendanceChart from "./UI/analytics/DepartmentAttendanceChart";
import DepartmentEvents from "./UI/analytics/DepartmentEvents";
import DepartmentLeaderbord from "./UI/analytics/DeptLeaderbord";
// Dummy data (replace later with fetched data)
const DUMMY_COMPARISON_DATA = {
    deptA: {
        name: "Mechanical Engineering (ME)",
        overallAttendance: 85.5,
        today: { overall: 88.0, morning: 89.5, afternoon: 86.5 },
        thisMonthAvg: 86.2,
        totalDivisions: 15,
        totalYears: 4,
        eventsDone: 6,
        recentEvent: "CAD Design Seminar (Oct 20)",
        bestClass: "ME 2nd Year Division C (93.5%)",
    },
    deptB: {
        name: "Civil Engineering (CE)",
        overallAttendance: 79.8,
        today: { overall: 80.5, morning: 81.0, afternoon: 80.0 },
        thisMonthAvg: 80.1,
        totalDivisions: 9,
        totalYears: 4,
        eventsDone: 4,
        recentEvent: "Sustainable Infra Talk (Oct 18)",
        bestClass: "CE 3rd Year Division A (87.2%)",
    },
};

const AVAILABLE_DEPARTMENTS = [
    { id: "ME", name: "Mechanical Engineering (ME)" },
    { id: "CE", name: "Civil Engineering (CE)" },
    { id: "CS", name: "Computer Science (CS)" },
    { id: "EE", name: "Electrical Engineering (EE)" },
];

const OverallAnalyticsSummary = () => (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg transition-opacity duration-500 ease-in-out">
        <h3 className="text-lg md:text-xl font-semibold text-indigo-600 mb-4">
            Institution-Wide Summary 🌍
        </h3>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-center mt-6">

            {/* Card 1 */}
            <div className="p-4 border rounded-lg bg-indigo-50">
                <p className="text-3xl md:text-4xl font-black text-indigo-700 break-words">
                    84.2%
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Overall Avg. Attendance
                </p>
            </div>

            {/* Card 2 */}
            <div className="p-4 border rounded-lg bg-indigo-50">
                <p className="text-3xl md:text-4xl font-black text-indigo-700 break-words">
                    68
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Total Divisions Monitored
                </p>
            </div>

            {/* Card 3 */}
            <div className="p-4 border rounded-lg bg-indigo-50">
                <p className="text-3xl md:text-4xl font-black text-indigo-700 break-words">
                    12
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Active Departments
                </p>
            </div>
        </div>

        <p className="text-gray-500 mt-6 text-xs md:text-sm leading-relaxed">
            Institution-wide metrics, charts, and key performance indicators (KPIs).
        </p>
    </div>
);


export default function OverallAnalytics() {
    return (
        <div className="space-y-10 gap-2">
            {/* Overall Summary Section */}
            <OverallAnalyticsSummary />
            <DepartmentEvents />
            <DepartmentLeaderbord />
            {/* Department Comparison Section */}
            <div>
                <DepartmentAttendanceChart />
                <h2 className="text-2xl font-bold text-gray-800 pt-4 border-t mt-8 mb-4">
                    Department Quick Comparison
                </h2>

                <DepartmentComparison
                    data={DUMMY_COMPARISON_DATA}
                    availableDepartments={AVAILABLE_DEPARTMENTS}
                />

            </div>
        </div>
    );
}
