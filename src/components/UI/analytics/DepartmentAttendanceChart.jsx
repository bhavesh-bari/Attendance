"use client";
import React from "react";
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

// 🔥 UPDATED: Now accepts data and filter from Parent
export default function DepartmentAttendanceChart({ rawData = [], filterProp = "overall" }) {

    // Logic to determine which bars to show based on Parent's filter
    const getVisibleBars = () => {
        switch (filterProp) {
            case "morning":
                return [{ key: "morning", color: "#10b981", label: "Morning" }];
            case "afternoon":
                return [{ key: "afternoon", color: "#f59e0b", label: "Afternoon" }];
            case "both": // Using "both" or if parent passes specific logic
                return [
                    { key: "morning", color: "#10b981", label: "Morning" },
                    { key: "afternoon", color: "#f59e0b", label: "Afternoon" }
                ];
            case "overall":
            default:
                return [{ key: "overall", color: "#4f46e5", label: "Overall" }];
        }
    };

    const visibleBars = getVisibleBars();

    // Dynamic width calculation for scrolling if many departments exist
    const dynamicWidth = Math.max(800, rawData.length * 100);

    if (!rawData || rawData.length === 0) {
        return <div className="p-6 text-center text-gray-500">No data available for the current selection.</div>;
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg w-full overflow-hidden">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
                Department Attendance Analytics
            </h2>

            {/* Note: Filter buttons are removed here because they are now in the Parent Component (OverallAnalytics) */}

            {/* HORIZONTAL SCROLL WRAPPER */}
            <div className="w-full overflow-x-auto hide-scrollbar">
                <div style={{ minWidth: `${dynamicWidth}px` }}>
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

                            {/* Dynamically Render Bars */}
                            {visibleBars.map((bar) => (
                                <Bar
                                    key={bar.key}
                                    dataKey={bar.key}
                                    fill={bar.color}
                                    name={bar.label}
                                    radius={[6, 6, 0, 0]}
                                >
                                    <LabelList dataKey={bar.key} position="top" formatter={(v) => `${v}%`} />
                                </Bar>
                            ))}

                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-6 text-center text-gray-600 text-sm">
                Showing {rawData.length} departments.
            </div>
        </div>
    );
}