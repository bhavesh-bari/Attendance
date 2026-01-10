"use client";
import React, { useState, useMemo } from "react";
// Ensure correct paths to your components
import ClassesComparison from "@/components/UI/analytics/ClassesComparision";
import DepartmentClassAttendanceChart from "@/components/UI/analytics/ClassAttendanceChart";
import ClassesEvents from "@/components/UI/analytics/ClassesEvents";
import Filter from "@/components/UI/Filter";

// Enhanced DUMMY DATA for filtering demonstration
const INITIAL_DEPARTMENT_CLASS_DATA = {
    "Mechanical Engineering (ME)": {
        classes: [
            { name: "ME-A-1", overall_attendance: 92.3, morning: 95, afternoon: 90, eventsAttended: 3, topper: "Rohan S." },
            { name: "ME-B-1", overall_attendance: 88.7, morning: 90, afternoon: 87, eventsAttended: 2, topper: "Priya K." },
            { name: "ME-C-1", overall_attendance: 91.5, morning: 92, afternoon: 91, eventsAttended: 4, topper: "Amit R." },
        ],
    },
    "Civil Engineering (CE)": {
        classes: [
            { name: "CE-A-1", overall_attendance: 85.2, morning: 87, afternoon: 84, eventsAttended: 1, topper: "Anjali D." },
            { name: "CE-B-1", overall_attendance: 82.9, morning: 83, afternoon: 82, eventsAttended: 1, topper: "Sahil T." },
        ],
    },
    "Computer Science (CS)": {
        classes: [
            { name: "CS-A-1", overall_attendance: 95.1, morning: 96, afternoon: 94, eventsAttended: 5, topper: "Nina V." },
            { name: "CS-B-1", overall_attendance: 90.5, morning: 92, afternoon: 89, eventsAttended: 4, topper: "Leo P." },
        ],
    },
};

const INITIAL_EVENTS = [
    { event: "Robotics Workshop", date: "2025-08-12", classes: ["ME-A-1", "ME-B-1"], department: "Mechanical Engineering (ME)", shift: "afternoon" },
    { event: "Bridge Design", date: "2025-09-05", classes: ["CE-A-1"], department: "Civil Engineering (CE)", shift: "morning" },
    { event: "AutoCAD Contest", date: "2025-09-20", classes: ["ME-C-1", "CE-B-1"], department: "Mechanical Engineering (ME)", shift: "afternoon" },
    { event: "AI Hackathon", date: "2025-10-15", classes: ["CS-A-1", "CS-B-1"], department: "Computer Science (CS)", shift: "morning" },
    { event: "Circuit Debugging", date: "2025-11-10", classes: ["CS-A-1"], department: "Computer Science (CS)", shift: "afternoon" },
];

export default function DepartmentAnalytics() {
    // Centralized Filter State
    const [filters, setFilters] = useState({
        department: "All Departments",
        shift: "overall",
        timePeriod: "overall",
        startDate: "",
        endDate: "",
    });

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // --- Filtering Logic for ATTENDANCE/BAR CHART ---
    const filteredAttendanceData = useMemo(() => {
        const { department, timePeriod, startDate, endDate } = filters;

        // 1. Filter Departments
        const filteredDeptKey = department === "All Departments"
            ? Object.keys(INITIAL_DEPARTMENT_CLASS_DATA)
            : [department];

        // 2. Aggregate or combine classes based on selected departments
        let allClasses = filteredDeptKey.flatMap(dept =>
            INITIAL_DEPARTMENT_CLASS_DATA[dept]?.classes || []
        );

        // NOTE: Time period filtering (timePeriod, startDate, endDate) would normally happen here by
        // adjusting the data values (overall/morning/afternoon) based on a server query.
        // For DUMMY DATA, we skip the time filter's value application but retain the filter UI.

        return allClasses.map(cls => ({
            name: cls.name,
            overall: cls.overall_attendance,
            morning: cls.morning,
            afternoon: cls.afternoon,
        }));
    }, [filters]);

    // --- Filtering Logic for COMPARISON CHART ---
    // Comparison Chart only filters by Department, not Shift or Time
    const filteredComparisonData = useMemo(() => {
        const { department } = filters;

        if (department === "All Departments") {
            return INITIAL_DEPARTMENT_CLASS_DATA;
        }

        return {
            [department]: INITIAL_DEPARTMENT_CLASS_DATA[department],
        };
    }, [filters]);


    // --- Filtering Logic for EVENTS CHART ---
    const filteredEvents = useMemo(() => {
        const { department } = filters;

        if (department === "All Departments") {
            return INITIAL_EVENTS;
        }

        return INITIAL_EVENTS.filter(event => event.department === department);
    }, [filters]);


    // Determine the department name to display in the header for the bar chart
    const currentDeptForChart = filters.department === "All Departments" ? "All Departments" : filters.department;
    const OverallAnalyticsSummary = () => (
        <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg transition-opacity duration-500 ease-in-out">
            <h3 className="text-lg md:text-xl font-semibold text-indigo-600 mb-4">
                Department-Wide Summary 🌍
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
                        8
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                        Total Divisions Monitored
                    </p>
                </div>

                <div className="p-4 border rounded-lg bg-indigo-50">
                    <p className="text-3xl md:text-4xl font-black text-indigo-700 break-words">
                        CS 2 B
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                        Top Performing Class
                    </p>
                </div>
            </div>

            <p className="text-gray-500 mt-6 text-xs md:text-sm leading-relaxed">
                Department-wide metrics, charts, and key performance indicators (KPIs).
            </p>
        </div>
    );
    return (
        <div className="p-2 bg-gray-100 rounded-xl shadow-lg transition-opacity duration-500 ease-in-out space-y-4 w-full">

            {/* Filter Component - All Filters used here */}
            <div className="bg-white rounded-lg shadow-md p-2">
                <Filter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </div>
            <OverallAnalyticsSummary />
            {/* Attendance Bar Chart - Filters: Department, Shift, Time */}
            <div className="bg-white rounded-lg shadow-md">
                <DepartmentClassAttendanceChart
                    data={filteredAttendanceData}
                    selectedDept={currentDeptForChart}
                    selectedShift={filters.shift}
                />
            </div>

            {/* Events Pie Chart - Filters: Department, Time */}
            <div className="bg-white rounded-lg shadow-md">
                <ClassesEvents
                    department={currentDeptForChart}
                    events={filteredEvents}
                    onClose={() => handleFilterChange("department", "All Departments")} // Example: clicking 'back' resets department filter
                />
            </div>

            {/* Classes Comparison Section - Filters: Department, Time (Shift excluded) */}
            <div className="border rounded-lg bg-indigo-50 p-4">
                <h3 className="text-xl font-medium text-indigo-700 mb-3">
                    Classes Comparison (Filtered by Department & Time)
                </h3>
                <div className="bg-white rounded-lg shadow-md">
                    <ClassesComparison
                        department={currentDeptForChart}
                    />
                </div>
            </div>
        </div>
    );
}