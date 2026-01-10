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

// Tooltip Formatter
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border rounded-lg shadow-md p-3 text-sm">
                <p className="font-semibold text-gray-800">{label}</p>
                {payload.map((entry) => (
                    <p key={entry.name} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}%
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function DepartmentClassAttendanceChart({
    data = [],
    selectedDept = "N/A",
    selectedShift = "overall",
}) {
    // Determine visible bars
    let barsToShow = [];
    if (selectedShift === "morning") {
        barsToShow = [{ key: "morning", name: "Morning", color: "#10b981" }];
    } else if (selectedShift === "afternoon") {
        barsToShow = [{ key: "afternoon", name: "Afternoon", color: "#f59e0b" }];
    } else if (selectedShift === "both") {
        barsToShow = [
            { key: "morning", name: "Morning", color: "#10b981" },
            { key: "afternoon", name: "Afternoon", color: "#f59e0b" },
        ];
    } else {
        barsToShow = [{ key: "overall", name: "Overall", color: "#4f46e5" }];
    }

    if (data.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                No attendance data available for the selected department/filters.
            </div>
        );
    }

    // 🔥 **Dynamic width logic for bars**
    const dynamicWidth = Math.max(900, data.length * (barsToShow.length * 90));

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg w-full overflow-hidden">

            {/* Title */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="text-2xl font-bold text-indigo-700 mb-2 md:mb-0">
                    {selectedDept} — Class Attendance Analytics
                </h2>
            </div>

            {/* Scrollable Chart */}
            <div className="w-full overflow-x-auto hide-scrollbar">
                <div style={{ minWidth: dynamicWidth }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
                            barCategoryGap="15%"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={80}
                                tick={{ fontSize: 12 }}
                            />

                            <YAxis
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`}
                                tick={{ fontSize: 12 }}
                            />

                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: 10 }} />

                            {/* Bars */}
                            {barsToShow.map((bar) => (
                                <Bar
                                    key={bar.key}
                                    dataKey={bar.key}
                                    fill={bar.color}
                                    name={bar.name}
                                    radius={[6, 6, 0, 0]}
                                >
                                    <LabelList
                                        dataKey={bar.key}
                                        position="top"
                                        formatter={(v) => `${v}%`}
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-gray-600 text-sm">
                Showing {data.length} classes from {selectedDept} for {selectedShift} shift.
            </div>

        </div>
    );
}
