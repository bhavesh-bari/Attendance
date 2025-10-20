// /app/dashboard/page.js (Next.js App Router)
"use client";
import React, { useState } from 'react';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import FilterSection from '@/components/FilterSection';
import AttendancePieChart from '@/components/charts/AttendancePieChart';
import Leaderboard from '@/components/Leaderboard';
import ExportButtons from '@/components/ExportButtons';
import { initialAttendanceData } from '@/data/attendanceData';

const mockDashboardState = {
    selectedDept: 'CSE',
    selectedYear: '3rd Year',
    dateRange: 'Daily',
    isComparing: false,
};

const DashboardPage = () => {

    const [filters, setFilters] = useState(mockDashboardState);
    const chartData = initialAttendanceData.dailyData; 

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header userName="Dr. Elara Vance" title="College Attendance Analytics" />

            <main className="flex-1 p-4 md:p-6 lg:p-8">
                {/* Quick Summary Cards (KPIs) */}
                <SummaryCards />

                {/* --- */}

                {/* Filters and Controls */}
                <div className="bg-white p-4 rounded-xl shadow-lg mb-6 sticky top-0 z-10 border-t-4 border-indigo-500">
                    <FilterSection filters={filters} setFilters={setFilters} />
                </div>

                {/* --- */}

                {/* Main Charts Grid */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Row 1: Daily Attendance Pie Chart */}
                    <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Daily Attendance Split</h2>
                        <AttendancePieChart data={chartData} />
                    </div>

                    {/* Placeholder for Department Bar Chart */}
                    <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Department Performance</h2>
                        <div className="h-64 flex items-center justify-center text-gray-400">Bar Chart Placeholder</div>
                    </div>

                    {/* Placeholder for Division Grouped Bar */}
                    <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-lg border-l-4 border-orange-500">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Division Comparison</h2>
                        <div className="h-64 flex items-center justify-center text-gray-400">Grouped Bar Placeholder</div>
                    </div>

                    {/* ... (Include placeholders for all 12 charts) ... */}

                    {/* Row 4: Leaderboard & Export */}
                    <div className="lg:col-span-2">
                        <Leaderboard data={initialAttendanceData.divisionSummary} />
                    </div>

                    <div className="lg:col-span-1 flex flex-col space-y-4">
                        <ExportButtons />
                        <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-blue-500">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Upcoming Event</h3>
                            <p className="text-sm text-gray-600">📌 Mid-Term Exams: Oct 25 - Oct 30</p>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
};

export default DashboardPage;