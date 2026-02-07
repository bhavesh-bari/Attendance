"use client";
import React, { useState, useEffect } from "react";
import { Users, BookOpen, BarChart3, Filter as FilterIcon } from "lucide-react";
import ClassesComparison from "@/components/UI/analytics/ClassesComparision";
import DepartmentClassAttendanceChart from "@/components/UI/analytics/ClassAttendanceChart";
import ClassesEvents from "@/components/UI/analytics/ClassesEvents";

/* ================= SKELETON COMPONENTS ================= */

const Skeleton = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
);

const DepartmentSkeleton = () => (
    <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-12 w-full md:w-80 rounded-xl" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                </div>
            ))}
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white rounded-lg shadow-md h-80 p-6 flex flex-col justify-end gap-2">
            <Skeleton className="h-6 w-48 mb-auto" />
            <div className="flex items-end gap-4 h-full">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="flex-1" style={{ height: `${Math.random() * 60 + 20}%` }} />
                ))}
            </div>
        </div>

        {/* Events Skeleton */}
        <div className="bg-white rounded-lg shadow-md h-64 p-6 flex items-center justify-center">
            <Skeleton className="h-40 w-40 rounded-full" />
            <div className="ml-6 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
    </div>
);

/* ================= MODERNISED FILTER BAR ================= */
const FilterBar = ({ filters, onFilterChange, departments = [] }) => {
    return (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 px-2 border-r border-gray-200 mr-2">
                <FilterIcon size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
            </div>

            <div className="flex flex-wrap gap-2">
                <select
                    value={filters.department}
                    onChange={(e) => onFilterChange("department", e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2 outline-none"
                >
                    {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

                <select
                    value={filters.shift}
                    onChange={(e) => onFilterChange("shift", e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2 outline-none"
                >
                    <option value="overall">Overall Shift</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                </select>

                <select
                    value={filters.timePeriod}
                    onChange={(e) => onFilterChange("timePeriod", e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2 outline-none"
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
    const [data, setData] = useState({
        summary: {},
        analytics: { classes: [], events: [] },
        filters: { availableDepartments: [], availableClasses: [] }
    });

    const [filters, setFilters] = useState({
        department: "",
        shift: "overall",
        timePeriod: "overall",
    });

    // Fetch Logic
    useEffect(() => {
        fetch('/api/analytics?scope=institution').then(res => res.json()).then(res => {
            if (res.success && res.filters.availableDepartments.length > 0) {
                setFilters(prev => ({ ...prev, department: res.filters.availableDepartments[0] }));
            }
        });
    }, []);

    useEffect(() => {
        if (!filters.department) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    scope: "department", department: filters.department, period: filters.timePeriod,
                });
                const res = await fetch(`/api/analytics?${query.toString()}`);
                const result = await res.json();
                if (result.success) setData(result);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filters.department, filters.timePeriod]);

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // User-Centric Loading Integration
    if (loading && !data.summary.departmentAvgAttendance) {
        return <DepartmentSkeleton />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* 1. Header & Filters Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{filters.department} Dashboard</h2>
                    <p className="text-gray-500 text-sm">Detailed breakdown of attendance and academic events.</p>
                </div>
                <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    departments={data.filters?.availableDepartments || []}
                />
            </div>

            {/* 2. New User-Centric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    icon={<BarChart3 className="text-indigo-600" />}
                    label="Avg. Attendance"
                    value={`${data.summary.departmentAvgAttendance || 0}%`}
                    bgColor="bg-indigo-50"
                />
                <StatCard
                    icon={<BookOpen className="text-emerald-600" />}
                    label="Total Classes"
                    value={data.summary.totalDivisions || 0}
                    bgColor="bg-emerald-50"
                />
                <StatCard
                    icon={<Users className="text-amber-600" />}
                    label="Total Students"
                    value={data.summary.totalStudents || 0}
                    bgColor="bg-amber-50"
                />
            </div>

            {/* 3. Original Components */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <DepartmentClassAttendanceChart
                    data={data.analytics.classes}
                    selectedDept={filters.department}
                    selectedShift={filters.shift}
                />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ClassesEvents
                    department={filters.department}
                    events={data.analytics.events}
                />
            </div>

            <div className="border rounded-lg bg-indigo-50 p-4">
                <h3 className="text-xl font-medium text-indigo-700 mb-3">
                    Classes Comparison
                </h3>
                <div className="bg-white rounded-lg shadow-md">
                    <ClassesComparison
                        availableClasses={data.filters?.availableClasses?.map(c => ({ id: c._id, name: c.name })) || []}
                    />
                </div>
            </div>

        </div>
    );
}

function StatCard({ icon, label, value, bgColor }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${bgColor}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-gray-900">{value}</p>
            </div>
        </div>
    );
}