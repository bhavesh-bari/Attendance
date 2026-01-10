"use client";
import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
    LabelList,
} from "recharts";

// Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-indigo-200 rounded-lg shadow-md p-3 text-sm">
                <p className="font-semibold text-indigo-700 mb-1">{label}</p>
                {payload.map((entry) => (
                    <p key={entry.name} style={{ color: entry.color }}>
                        {entry.name}: <span className="font-semibold">{entry.value}%</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function DepartmentAttendanceAnalytics() {
    const rawData = [
        { name: "Mechanical", overall: 88.3, morning: 90.1, afternoon: 86.4 },
        { name: "Computer", overall: 84.6, morning: 86.2, afternoon: 82.5 },
        { name: "Electrical", overall: 82.1, morning: 83.7, afternoon: 80.8 },
        { name: "IT", overall: 87.5, morning: 89.3, afternoon: 85.4 },
        { name: "Civil", overall: 79.8, morning: 81.6, afternoon: 78.2 },
        { name: "ENTC", overall: 85.9, morning: 88.1, afternoon: 83.7 },
        { name: "Production", overall: 80.5, morning: 82.0, afternoon: 79.0 },
        { name: "AI", overall: 91.2, morning: 92.5, afternoon: 90.3 },
    ];

    const [filter, setFilter] = useState("overall");

    // Filter Logic
    const getFilteredBars = () => {
        switch (filter) {
            case "overall":
                return ["overall"];
            case "morning":
                return ["morning"];
            case "afternoon":
                return ["afternoon"];
            case "both":
                return ["morning", "afternoon"];
            default:
                return ["overall"];
        }
    };

    const visibleBars = getFilteredBars();

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg w-full overflow-hidden">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
                Department Attendance Analytics
            </h2>

            {/* FILTER BUTTONS */}
            <div className="flex gap-3 justify-center mb-4">
                {["overall", "morning", "afternoon", "both"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                            filter === f
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white text-indigo-600 border-indigo-300"
                        }`}
                    >
                        {f === "overall"
                            ? "Overall"
                            : f === "both"
                            ? "Morning + Afternoon"
                            : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* HORIZONTAL SCROLL */}
            <div className="w-full overflow-x-auto hide-scrollbar">
                <div
                    className="flex justify-center"
                    style={{
                        minWidth: `${rawData.length * 120}px`, // dynamic size per bar
                    }}
                >
                    <ResponsiveContainer width="100%" height={420}>
                        <BarChart
                            data={rawData}
                            margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                angle={-30}
                                textAnchor="end"
                                interval={0}
                                height={80}
                                tick={{ fontSize: 12, fill: "#374151" }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`}
                                tick={{ fontSize: 12, fill: "#374151" }}
                            />

                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                            <Legend wrapperStyle={{ paddingTop: 10 }} />

                            {/* Bars With Labels */}
                            {visibleBars.includes("overall") && (
                                <Bar dataKey="overall" fill="#4f46e5" radius={[6, 6, 0, 0]}>
                                    <LabelList dataKey="overall" position="top" formatter={(v) => `${v}%`} />
                                </Bar>
                            )}

                            {visibleBars.includes("morning") && (
                                <Bar dataKey="morning" fill="#10b981" radius={[6, 6, 0, 0]}>
                                    <LabelList dataKey="morning" position="top" formatter={(v) => `${v}%`} />
                                </Bar>
                            )}

                            {visibleBars.includes("afternoon") && (
                                <Bar dataKey="afternoon" fill="#f59e0b" radius={[6, 6, 0, 0]}>
                                    <LabelList dataKey="afternoon" position="top" formatter={(v) => `${v}%`} />
                                </Bar>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-6 text-center text-gray-600 text-sm">
                Showing {rawData.length} departments’ attendance.
            </div>
        </div>
    );
}
