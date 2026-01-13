"use client";
import React, { useState } from "react";
import DepartmentComparison from "@/components/UI/analytics/DepartmentComparison";
import DepartmentAttendanceChart from "./UI/analytics/DepartmentAttendanceChart";
import DepartmentEvents from "./UI/analytics/DepartmentEvents";
import DepartmentLeaderbord from "./UI/analytics/DeptLeaderbord";

/* =========================================================================
   INTERNAL FILTER COMPONENT
   ========================================================================= */
const Filter = ({ filters, onFilterChange, excludedFilters = [] }) => {

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    const isExcluded = (name) => excludedFilters.includes(name);

    return (
        <div className="w-full overflow-x-auto py-2 hide-scrollbar" >
            <div className="flex gap-4 min-w-max px-2">

                {/* --- DEPARTMENT FILTER REMOVED --- */}

                {/* Shift Filter */}
                {!isExcluded("shift") && (
                    <select
                        name="shift"
                        value={filters.shift}
                        onChange={handleSelectChange}
                        className="border bg-white border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm hover:border-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="overall">Overall</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="both">Both</option>
                    </select>
                )}

                {/* Time Period Filter */}
                {!isExcluded("timePeriod") && (
                    <select
                        name="timePeriod"
                        value={filters.timePeriod}
                        onChange={handleSelectChange}
                        className="border bg-white border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm hover:border-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="overall">Overall</option>
                        <option value="today">Today</option>
                        <option value="monthly">This Month</option>
                        <option value="custom">Custom Range</option>
                    </select>
                )}

                {/* Custom Date Range - Only show if timePeriod is custom */}
                {filters.timePeriod === "custom" && !isExcluded("startDate") && !isExcluded("endDate") && (
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleSelectChange}
                            className="border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm hover:border-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-500">to</span>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleSelectChange}
                            className="border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm hover:border-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

/* =========================================================================
   DUMMY DATA
   ========================================================================= */

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
    // 1. Initialize State for Filters
    // Note: 'department' is kept in state as a default value but the control is removed from UI
    const [filters, setFilters] = useState({
        department: "All Departments",
        shift: "overall",
        timePeriod: "overall",
        startDate: "",
        endDate: "",
    });

    // 2. Handle Filter Changes
    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-10 gap-2">
            {/* Overall Summary Section */}
            <OverallAnalyticsSummary />

            {/* --- NEW FILTER SECTION (Without Department) --- */}
            <div className="bg-white rounded-lg shadow-md p-2 -mt-4">
                <Filter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </div>
            {/* --------------------------- */}

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