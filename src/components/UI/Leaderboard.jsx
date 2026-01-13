"use client";
import React, { useState } from 'react';
import { Trophy, AlertCircle, Users, Medal, Search, Filter, Download, ChevronRight } from 'lucide-react';

// --- Utility for styles ---
const getRankStyles = (rank, isTop) => {
    if (!isTop) return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'bg-red-100 text-red-600' };

    switch (rank) {
        case 1: return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-800', icon: 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow-yellow-200' };
        case 2: return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', icon: 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-gray-200' };
        case 3: return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: 'bg-gradient-to-br from-orange-300 to-orange-400 text-white shadow-orange-200' };
        default: return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'bg-green-100 text-green-600' };
    }
};

const LeaderboardItem = ({ rank, dept, division, percentage, totalStudents, isTop }) => {
    const styles = getRankStyles(rank, isTop);

    return (
        <div className={`group relative flex flex-col p-4 rounded-xl border ${styles.bg} ${styles.border} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
            {/* Top Row: Rank & Info */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-md ${styles.icon}`}>
                        {isTop && rank <= 3 ? <Medal size={18} /> : <span>#{rank}</span>}
                    </div>

                    {/* Details */}
                    <div>
                        <h4 className={`font-bold text-sm ${styles.text}`}>
                            {dept} <span className="text-gray-400 font-normal mx-1">|</span> {division}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                                <Users size={12} /> {totalStudents || '0'} Avg Presence
                            </span>
                        </div>
                    </div>
                </div>

                {/* Percentage Big Number */}
                <div className="text-right">
                    <div className={`text-2xl font-black ${styles.text} flex items-center justify-end gap-1`}>
                        {parseFloat(percentage).toFixed(1)}%
                    </div>
                    <div className="flex items-center justify-end text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Attendance
                    </div>
                </div>
            </div>

            {/* Visual Bar Graph Effect */}
            <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden shadow-inner">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isTop ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-rose-600'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// --- Full Leaderboard Table ---
const FullLeaderboardTable = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter logic
    const filteredData = data.filter(item =>
        item.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.className?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (percentage) => {
        const val = parseFloat(percentage);
        if (val >= 90) return <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-md border border-green-200">Excellent</span>;
        if (val >= 75) return <span className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-md border border-blue-200">Good</span>;
        if (val >= 60) return <span className="px-2 py-1 text-xs font-bold text-orange-700 bg-orange-100 rounded-md border border-orange-200">Average</span>;
        return <span className="px-2 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-md border border-red-200">Critical</span>;
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-8">
            {/* Header / Tools */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Complete Division Rankings</h3>
                    <p className="text-sm text-gray-500">Showing {data.length} classes</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search Dept or Class..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full md:w-64 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full">
                    <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 text-left">Rank</th>
                            <th className="px-6 py-4 text-left">Department & Class</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-left w-1/4">Performance Trend</th>
                            <th className="px-6 py-4 text-right">Avg. Attendance</th>
                            <th className="px-6 py-4 text-right">Avg. Present Stud</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.map((item, index) => {
                            const rank = index + 1;
                            const isTop3 = rank <= 3;
                            const percentage = parseFloat(item.percentage);
                            const avgstud = parseFloat(item.studentCounts);
                            return (
                                <tr key={index} className="group hover:bg-indigo-50/30 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm 
                                            ${rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                                rank === 2 ? 'bg-gray-100 text-gray-700' :
                                                    rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>
                                            {rank}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 text-sm">{item.department}</span>
                                            <span className="text-xs text-gray-500">Class {item.className}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {getStatusBadge(percentage)}
                                    </td>

                                    <td className="px-6 py-4 align-middle">
                                        <div className="w-full max-w-[140px]">
                                            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                                <span>Progress</span>
                                                <span>{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${isTop3 ? 'bg-green-500' : percentage < 50 ? 'bg-red-500' : 'bg-indigo-500'}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-lg font-bold ${percentage < 75 ? 'text-red-600' : 'text-gray-800'}`}>
                                            {percentage.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-lg font-bold ${percentage < 75 ? 'text-red-600' : 'text-gray-800'}`}>
                                            {avgstud}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredData.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    <p>No data found matching your filters.</p>
                </div>
            )}
        </div>
    );
};

// --- MAIN PARENT COMPONENT ---
export default function Leaderboard({ data = [] }) {
    // 1. Process Data
    // API Returns: { className, department, percentage, studentCounts }
    // Ensure numeric sort
    const sortedData = [...data].sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

    const topPerformers = sortedData.slice(0, 3);
    const bottomPerformers = sortedData.slice(-3).reverse();

    if (data.length === 0) return null;

    return (
        <div className="font-sans space-y-8">
            {/* 1. HIGHLIGHT CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performers */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Trophy className="text-yellow-500 fill-yellow-500" size={24} />
                                Top Performers
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Leading classes this period</p>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        {topPerformers.map((item, index) => (
                            <LeaderboardItem
                                key={`top-${index}`}
                                rank={index + 1}
                                dept={item.department}
                                division={item.className}
                                percentage={parseFloat(item.percentage)}
                                totalStudents={item.studentCounts} // API key mapped
                                isTop={true}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom Performers */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-red-50 to-white border-b border-red-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <AlertCircle className="text-red-500" size={24} />
                                Critical Focus
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Classes needing immediate intervention</p>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        {bottomPerformers.map((item, index) => (
                            <LeaderboardItem
                                key={`bottom-${index}`}
                                rank={index + 1}
                                dept={item.department}
                                division={item.className}
                                percentage={parseFloat(item.percentage)}
                                totalStudents={item.studentCounts} // API key mapped
                                isTop={false}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. FULL TABLE */}
            <FullLeaderboardTable data={sortedData} />
        </div>
    );
}