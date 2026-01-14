"use client";
import React, { useState, useEffect } from "react";
import DepartmentComparison from "@/components/UI/analytics/DepartmentComparison";
import DepartmentAttendanceChart from "./UI/analytics/DepartmentAttendanceChart";
import DepartmentEvents from "./UI/analytics/DepartmentEvents";

/* ================= FILTER COMPONENT ================= */
const Filter = ({ filters, onFilterChange, excludedFilters = [] }) => {
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    const isExcluded = (name) => excludedFilters.includes(name);

    return (
        <div className="w-full overflow-x-auto py-2 hide-scrollbar">
            <div className="flex gap-4 min-w-max px-2">
                {/* Shift Filter */}
                {!isExcluded("shift") && (
                    <select
                        name="shift"
                        value={filters.shift}
                        onChange={handleSelectChange}
                        className="border bg-white border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="overall">Overall Shift</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                    </select>
                )}

                {/* Time Period Filter */}
                {!isExcluded("timePeriod") && (
                    <select
                        name="timePeriod"
                        value={filters.timePeriod}
                        onChange={handleSelectChange}
                        className="border bg-white border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="overall">All Time</option>
                        <option value="today">Today</option>
                        <option value="monthly">This Month</option>
                        <option value="custom">Custom Range</option>
                    </select>
                )}

                {/* Custom Date Range */}
                {filters.timePeriod === "custom" && (
                    <div className="flex items-center gap-2">
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleSelectChange} className="border px-3 py-2 text-sm rounded-lg" />
                        <span className="text-sm text-gray-500">to</span>
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleSelectChange} className="border px-3 py-2 text-sm rounded-lg" />
                    </div>
                )}
            </div>
        </div>
    );
};

const OverallAnalyticsSummary = ({ stats }) => (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg">
        <h3 className="text-lg md:text-xl font-semibold text-indigo-600 mb-4">Institution-Wide Summary 🌍</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-center mt-6">
            <div className="p-4 border rounded-lg bg-indigo-50">
                <p className="text-3xl md:text-4xl font-black text-indigo-700 break-words">{stats?.overallAvgAttendance || 0}%</p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Overall Avg. Attendance</p>
            </div>
            <div className="p-4 border rounded-lg bg-indigo-50">
                <p className="text-3xl md:text-4xl font-black text-indigo-700 break-words">{stats?.totalDivisions || 0}</p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Total Divisions</p>
            </div>
            <div className="p-4 border rounded-lg bg-indigo-50">
                <p className="text-3xl md:text-4xl font-black text-indigo-700 break-words">{stats?.activeDepartments || 0}</p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Active Departments</p>
            </div>
        </div>
    </div>
);

export default function OverallAnalytics() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ summary: {}, analytics: { classes: [], events: [] }, filters: { availableDepartments: [] } });

    const [filters, setFilters] = useState({
        shift: "overall",
        timePeriod: "overall",
        startDate: "",
        endDate: "",
    });

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    scope: "institution",
                    period: filters.timePeriod,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                });
                const res = await fetch(`/api/analytics?${query.toString()}`);
                const result = await res.json();
                if (result.success) setData(result);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters]);

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Transform Class Data to Department Data for the Bar Chart
    const processDeptData = () => {
        const deptMap = {};
        data.analytics.classes.forEach(c => {
            if (!deptMap[c.department]) {
                deptMap[c.department] = { name: c.department, totalOverall: 0, totalMorn: 0, totalAft: 0, count: 0 };
            }
            deptMap[c.department].totalOverall += parseFloat(c.overall);
            deptMap[c.department].totalMorn += parseFloat(c.morning);
            deptMap[c.department].totalAft += parseFloat(c.afternoon);
            deptMap[c.department].count += 1;
        });

        return Object.values(deptMap).map(d => ({
            name: d.name,
            overall: (d.totalOverall / d.count).toFixed(1),
            morning: (d.totalMorn / d.count).toFixed(1),
            afternoon: (d.totalAft / d.count).toFixed(1)
        }));
    };

    if (loading && !data.summary.overallAvgAttendance) return <div className="p-10 text-center">Loading Analytics...</div>;

    const availableDepts = data.filters?.availableDepartments?.map(d => ({ id: d, name: d })) || [];

    return (
        <div className="space-y-10 gap-2">
            <OverallAnalyticsSummary stats={data.summary} />

            <div className="bg-white rounded-lg shadow-md p-2 -mt-4">
                <Filter filters={filters} onFilterChange={handleFilterChange} />
            </div>

            {/* Pass processed data to charts */}
            <DepartmentEvents events={data.analytics.events} />


            <div>
                {/* The Chart expects an array of {name, overall, morning, afternoon} */}
                <DepartmentAttendanceChart rawData={processDeptData()} filterProp={filters.shift} />

                <h2 className="text-2xl font-bold text-gray-800 pt-4 border-t mt-8 mb-4">
                    Department Quick Comparison
                </h2>
                {/* DepartmentComparison needs to manage its own fetching based on dropdowns
                   We pass the list of departments so it can populate dropdowns.
                */}
                <DepartmentComparison
                    availableDepartments={availableDepts}
                />
            </div>
        </div>
    );
}