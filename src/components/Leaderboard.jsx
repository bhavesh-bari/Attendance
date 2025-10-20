// /components/Leaderboard.js
import React from 'react';

// Card component for a single leaderboard entry
const LeaderboardItem = ({ rank, dept, division, year, percentage, isTop }) => {
    // Green for Top performers, Red for Bottom performers
    const colorClass = isTop ? 'text-green-600 bg-green-50 border-green-500' : 'text-red-600 bg-red-50 border-red-500';
    const indicatorClass = isTop ? 'bg-green-600' : 'bg-red-600';

    return (
        <div className={`flex items-center justify-between p-4 rounded-xl shadow-sm border-l-4 ${colorClass} hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-center space-x-4">
                <span className={`w-8 h-8 flex items-center justify-center font-bold text-white rounded-full ${indicatorClass}`}>
                    {rank}
                </span>
                <div>
                    <p className="font-semibold text-gray-800">{dept} / {year} - Div {division}</p>
                    <p className="text-xs text-gray-500">Total Students: {division.totalStudents || 'N/A'}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xl font-extrabold">{percentage.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Avg. Attendance</p>
            </div>
        </div>
    );
};


const Leaderboard = ({ data }) => {
    // 1. Sort the data by avgAttendance
    const sortedData = [...data].sort((a, b) => b.avgAttendance - a.avgAttendance);

    // 2. Identify Top 3 and Bottom 3
    const topPerformers = sortedData.slice(0, 3);
    const bottomPerformers = sortedData.slice(-3).reverse(); // Reverse to show rank 1, 2, 3 from the bottom

    return (
        <div className="space-y-6">

            {/* Top Performers (Green) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    Top 3 Divisions 🏆
                </h2>
                <div className="space-y-3">
                    {topPerformers.map((item, index) => (
                        <LeaderboardItem
                            key={`top-${index}`}
                            rank={index + 1}
                            dept={item.dept}
                            division={item.div}
                            year={item.year}
                            percentage={item.avgAttendance}
                            isTop={true}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Performers (Red) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    Bottom 3 Divisions 🚨
                </h2>
                <div className="space-y-3">
                    {bottomPerformers.map((item, index) => (
                        <LeaderboardItem
                            key={`bottom-${index}`}
                            rank={index + 1} // Rank 1 is the absolute lowest
                            dept={item.dept}
                            division={item.div}
                            year={item.year}
                            percentage={item.avgAttendance}
                            isTop={false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;