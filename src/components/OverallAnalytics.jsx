"use client";
import React, { useState, useEffect } from "react";
import { Globe, LayoutGrid, Building2, Filter as FilterIcon, Calendar } from "lucide-react";
import DepartmentComparison from "@/components/UI/analytics/DepartmentComparison";
import DepartmentAttendanceChart from "./UI/analytics/DepartmentAttendanceChart";
import DepartmentEvents from "./UI/analytics/DepartmentEvents";

/* ================= MODERNISED OVERALL FILTER ================= */
const Filter = ({ filters, onFilterChange, excludedFilters = [] }) => {
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    const isExcluded = (name) => excludedFilters.includes(name);

    return (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 px-2 border-r border-gray-200 mr-2">
                <FilterIcon size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {!isExcluded("shift") && (
                    <select
                        name="shift"
                        value={filters.shift}
                        onChange={handleSelectChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2 outline-none"
                    >
                        <option value="overall">Overall Shift</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                    </select>
                )}

                {!isExcluded("timePeriod") && (
                    <select
                        name="timePeriod"
                        value={filters.timePeriod}
                        onChange={handleSelectChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2 outline-none"
                    >
                        <option value="overall">All Time</option>
                        <option value="today">Today</option>
                        <option value="monthly">This Month</option>
                        <option value="custom">Custom Range</option>
                    </select>
                )}

                {filters.timePeriod === "custom" && (
                    <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleSelectChange} className="border border-gray-300 px-2 py-1.5 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <span className="text-gray-400">to</span>
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleSelectChange} className="border border-gray-300 px-2 py-1.5 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                )}
            </div>
        </div>
    );
};

/* ================= USER-CENTRIC SUMMARY ================= */
const OverallAnalyticsSummary = ({ stats }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
            icon={<Globe className="text-indigo-600" />}
            label="Inst. Avg. Attendance"
            value={`${stats?.overallAvgAttendance || 0}%`}
            bgColor="bg-indigo-50"
        />
        <StatCard
            icon={<LayoutGrid className="text-emerald-600" />}
            label="Total Divisions"
            value={stats?.totalDivisions || 0}
            bgColor="bg-emerald-50"
        />
        <StatCard
            icon={<Building2 className="text-amber-600" />}
            label="Active Departments"
            value={stats?.activeDepartments || 0}
            bgColor="bg-amber-50"
        />
    </div>
);

function StatCard({ icon, label, value, bgColor }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
            <div className={`p-4 rounded-xl ${bgColor}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
            </div>
        </div>
    );
}

export default function OverallAnalytics() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ summary: {}, analytics: { classes: [], events: [] }, filters: { availableDepartments: [] } });

    const [filters, setFilters] = useState({
        shift: "overall",
        timePeriod: "overall",
        startDate: "",
        endDate: "",
    });

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

    if (loading && !data.summary.overallAvgAttendance) {
        return <div className="p-20 text-center font-medium text-gray-400 animate-pulse">Gathering Institution Insights...</div>;
    }

    const availableDepts = data.filters?.availableDepartments?.map(d => ({ id: d, name: d })) || [];

    return (
        <div className="space-y-8">
            {/* 1. Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        Institutional Overview
                    </h2>
                    <p className="text-gray-500 text-sm">Cross-departmental performance metrics.</p>
                </div>
                <Filter filters={filters} onFilterChange={handleFilterChange} />
            </div>

            {/* 2. Stat Cards */}
            <OverallAnalyticsSummary stats={data.summary} />

            {/* 3. Original Components - Style Maintained */}
            <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <DepartmentEvents events={data.analytics.events} />
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden p-1">
                    <DepartmentAttendanceChart rawData={processDeptData()} filterProp={filters.shift} />
                </div>

                <div className="pt-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-800">Department Quick Comparison</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-100">
                        <DepartmentComparison availableDepartments={availableDepts} />
                    </div>
                </div>
            </div>
        </div>
    );
}