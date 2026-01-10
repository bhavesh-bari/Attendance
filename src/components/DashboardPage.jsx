"use client";
import React from 'react';
import SummaryCards from '@/components/UI/SummaryCards';
import Leaderboard from '@/components/UI/Leaderboard';
import { initialAttendanceData } from '@/data/attendanceData';
import DashAttendanceBar from '@/components/UI/dashAttendanceBar';
import DashEvents from '@/components/UI/dashEvents';
const DashboardPage = () => {
    return (
        <div className=" md:ml-16 space-y-10 bg-gray-50 min-h-screen">

            {/* ✅ Summary Cards (wrapped in proper container) */}
            <div className="bg-white p-1 rounded-xl shadow-lg">
                <SummaryCards />
            </div>

            {/* ✅ Department Attendance Chart */}
            <div className="bg-white p-1 rounded-xl shadow-lg">
                <DashAttendanceBar />
            </div>

            <div className="bg-white p-1 rounded-xl shadow-lg">
                <DashEvents />
            </div>

            {/* ✅ Leaderboard (full width and consistent styling) */}
            <div className="bg-white p-1 rounded-xl shadow-lg">
                <Leaderboard data={initialAttendanceData.divisionSummary} />
            </div>

        </div>
    );
};

export default DashboardPage;
