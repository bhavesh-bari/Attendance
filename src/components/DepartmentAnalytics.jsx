"use client";
import React, { useState, useEffect } from "react";
import ClassesComparison from "@/components/UI/analytics/ClassesComparision";
import DepartmentClassAttendanceChart from "@/components/UI/analytics/ClassAttendanceChart";
import ClassesEvents from "@/components/UI/analytics/ClassesEvents";

/* ================= FILTER COMPONENT ================= */
const Filter = ({ filters, onFilterChange, departments = [] }) => {
    return (
        <div className="w-full overflow-x-auto py-2 hide-scrollbar">
            <div className="flex gap-4 min-w-max px-2">
                <select
                    name="department"
                    value={filters.department}
                    onChange={(e) => onFilterChange("department", e.target.value)}
                    className="border bg-white border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none"
                >
                    {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

                <select
                    name="shift"
                    value={filters.shift}
                    onChange={(e) => onFilterChange("shift", e.target.value)}
                    className="border bg-white border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none"
                >
                    <option value="overall">Overall Shift</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                </select>

                <select
                    name="timePeriod"
                    value={filters.timePeriod}
                    onChange={(e) => onFilterChange("timePeriod", e.target.value)}
                    className="border bg-white border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none"
                >
                    <option value="overall">All Time</option>
                    <option value="today">Today</option>
                    <option value="monthly">This Month</option>
                </select>
            </div>
        </div>
    );
};

export default function DepartmentAnalytics() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ summary: {}, analytics: { classes: [], events: [] }, filters: { availableDepartments: [], availableClasses: [] } });

    // Default filters
    const [filters, setFilters] = useState({
        department: "", // Will set after first fetch
        shift: "overall",
        timePeriod: "overall",
    });

    // 1. Initial Fetch to get Departments list
    useEffect(() => {
        fetch('/api/analytics?scope=institution').then(res => res.json()).then(res => {
            if (res.success && res.filters.availableDepartments.length > 0) {
                setFilters(prev => ({ ...prev, department: res.filters.availableDepartments[0] }));
            }
        });
    }, []);

    // 2. Fetch Department Data
    useEffect(() => {
        if (!filters.department) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    scope: "department",
                    department: filters.department,
                    period: filters.timePeriod,
                });
                const res = await fetch(`/api/analytics?${query.toString()}`);
                const result = await res.json();
                if (result.success) setData(result);
            } catch (error) {
                console.error("Failed to fetch department analytics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters.department, filters.timePeriod]);


    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    if (loading && !data.summary.departmentAvgAttendance) return <div className="p-10 text-center">Loading Department Data...</div>;

    const summary = data.summary;

    return (
        <div className="p-2 bg-gray-100 rounded-xl shadow-lg space-y-4 w-full">

            {/* Summary Cards */}
            <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg">
                <h3 className="text-lg md:text-xl font-semibold text-indigo-600 mb-4">
                    {filters.department} Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-center mt-6">
                    <div className="p-4 border rounded-lg bg-indigo-50">
                        <p className="text-3xl md:text-4xl font-black text-indigo-700">{summary.departmentAvgAttendance || 0}%</p>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">Avg. Attendance</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-indigo-50">
                        <p className="text-3xl md:text-4xl font-black text-indigo-700">{summary.totalDivisions || 0}</p>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">Total Classes</p>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-lg shadow-md p-2">
                <Filter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    departments={data.filters?.availableDepartments || []}
                />
            </div>

            {/* Attendance Bar Chart */}
            <div className="bg-white rounded-lg shadow-md">
                <DepartmentClassAttendanceChart
                    data={data.analytics.classes}
                    selectedDept={filters.department}
                    selectedShift={filters.shift}
                />
            </div>

            {/* Events Pie Chart */}
            <div className="bg-white rounded-lg shadow-md">
                <ClassesEvents
                    department={filters.department}
                    events={data.analytics.events}
                />
            </div>

            {/* Classes Comparison */}
            <div className="border rounded-lg bg-indigo-50 p-4">
                <h3 className="text-xl font-medium text-indigo-700 mb-3">
                    Classes Comparison
                </h3>
                <div className="bg-white rounded-lg shadow-md">
                    {/* Pass available classes for this dept so dropdowns can populate */}
                    <ClassesComparison
                        availableClasses={data.filters?.availableClasses?.map(c => ({ id: c._id, name: c.name })) || []}
                    />
                </div>
            </div>
        </div>
    );
}