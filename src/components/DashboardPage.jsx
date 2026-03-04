"use client";

import React, { useEffect, useState } from "react";
import {
    Filter, Calendar, RefreshCw,
    Clock, CalendarRange, Layers
} from "lucide-react";

// components
import SummaryCards from "@/components/UI/SummaryCards";
import DashAttendanceBar from "@/components/UI/dashAttendanceBar";
import DashEvents from "@/components/UI/dashEvents";
import Leaderboard from "@/components/UI/Leaderboard";

/* ================= SKELETON COMPONENTS ================= */
// Mimics your exact UI structure with a pulse effect
const Skeleton = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
);

const DashboardSkeleton = () => (
    <div className="md:ml-16 space-y-8 bg-gray-50/50 min-h-screen p-6 pb-20">
        {/* Summary Skeleton - Mimics SummaryCards box */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 border rounded-lg bg-indigo-50/30 flex flex-col items-center gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                ))}
            </div>
        </div>

        {/* Filter Skeleton - Mimics Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-full md:w-1/2 rounded-lg" />
            <Skeleton className="h-8 w-24" />
        </div>

        {/* Main Charts Skeleton */}
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-[350px]">
                <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-[300px]">
                <Skeleton className="h-full w-full rounded-lg" />
            </div>
        </div>
    </div>
);

const DashboardPage = () => {
    // --- 1. Data State ---
    const [chartData, setChartData] = useState({
        departmentAttendance: [],
        eventCounts: [],
        leaderboard: []
    });
    const [summaryData, setSummaryData] = useState(null);

    // --- 2. Loading & UI State ---
    const [loading, setLoading] = useState(true); // Changed: Initial load state
    const [isRefreshing, setIsRefreshing] = useState(false);

    // --- 3. Filter State ---
    const [filterType, setFilterType] = useState("today");
    const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    // --- Fetch: Summary Data ---
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch("/api/dashboard/overview");
                const data = await res.json();
                if (data.success) {
                    setSummaryData(data.dashboard);
                }
            } catch (err) {
                console.error("Summary fetch failed", err);
            }
        };
        fetchSummary();
    }, []);

    // --- Fetch: Chart Data ---
    useEffect(() => {
        const fetchCharts = async () => {
            setIsRefreshing(true);
            try {
                const params = new URLSearchParams();
                params.append('filter', filterType);

                if (filterType === 'date') {
                    params.append('date', customDate);
                } else if (filterType === 'range') {
                    params.append('from', dateRange.start);
                    params.append('to', dateRange.end);
                }

                const res = await fetch(`/api/dashboard/filter?${params.toString()}`);
                const responseData = await res.json();

                if (responseData.success) {
                    setChartData(responseData.data);
                }
            } catch (err) {
                console.error("Chart fetch failed", err);
            } finally {
                setLoading(false); // Stop showing skeleton
                setIsRefreshing(false); // Stop showing refresh spinner in filter bar
            }
        };

        const timeoutId = setTimeout(() => {
            fetchCharts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filterType, customDate, dateRange]);


    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="md:ml-16 space-y-8 bg-gray-50/50 min-h-screen p-6 pb-20 animate-in fade-in duration-500">

            {/* 1. Summary Cards Section */}
            <div className="bg-white p-1 rounded-xl shadow-lg border border-gray-100">
                {summaryData ? (
                    <SummaryCards dashboard={summaryData} />
                ) : (
                    <div className="p-8"><Skeleton className="h-20 w-full" /></div>
                )}
            </div>

            {/* 2. Filter UI */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">

                {/* Left: Filter Label & Icon */}
                <div className="flex items-center gap-2 text-gray-700 font-semibold min-w-fit">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Filter size={20} />
                    </div>
                    <span>Filter Charts</span>
                    {isRefreshing && <RefreshCw size={14} className="animate-spin text-gray-400 ml-2" />}
                </div>

                {/* Middle: Filter Type Tabs */}
                <div className="flex flex-wrap gap-2 p-1 bg-gray-100/80 rounded-lg w-full md:w-auto overflow-x-auto">
                    {[
                        { id: 'today', label: 'Today', icon: Clock },
                        { id: 'thisMonth', label: 'This Month', icon: Calendar },
                        { id: 'overall', label: 'Overall', icon: Layers },
                        { id: 'date', label: 'Specific Date', icon: Calendar },
                        { id: 'range', label: 'Date Range', icon: CalendarRange },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterType(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap
                                ${filterType === tab.id
                                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Right: Conditional Date Inputs */}
                <div className="flex items-center justify-end gap-3 w-full md:w-auto min-h-[40px]">
                    {filterType === 'date' && (
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm animate-in slide-in-from-right-4 fade-in duration-300">
                            <span className="text-xs text-gray-400 font-medium uppercase">Select Date:</span>
                            <input
                                type="date"
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                                className="text-sm text-gray-700 font-medium focus:outline-none cursor-pointer"
                            />
                        </div>
                    )}

                    {filterType === 'range' && (
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">From</span>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                    className="text-sm text-gray-700 font-medium focus:outline-none cursor-pointer w-28"
                                />
                            </div>
                            <div className="h-6 w-px bg-gray-200 mx-1"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">To</span>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                    className="text-sm text-gray-700 font-medium focus:outline-none cursor-pointer w-28"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Charts & Analytics Section */}
            {/* Added a stable layout transition for filter updates */}
            <div className={`space-y-8 transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>

                <div className="bg-white p-1 rounded-xl shadow-lg border border-gray-100">
                    <DashAttendanceBar
                        data={chartData.departmentAttendance}
                        filterType={filterType}
                        customDate={customDate}
                        dateRange={{ start: dateRange.start, end: dateRange.end }}
                    />
                </div>

                <div className="bg-white p-1 rounded-xl shadow-lg border border-gray-100">
                    <DashEvents data={chartData.eventCounts} />
                </div>

                <div className="bg-white p-1 rounded-xl shadow-lg border border-gray-100">
                    <Leaderboard data={chartData.leaderboard} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;