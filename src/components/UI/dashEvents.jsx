"use client";
import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ResponsiveContainer, LabelList,
} from "recharts";

const departmentColorPalette = [
    "#1E90FF", "#28A745", "#FF8C00", "#8A2BE2", "#DC143C",
    "#20B2AA", "#FF1493", "#6A5ACD", "#708090", "#A0522D",
];

const getDepartmentColors = (departments) => {
    const deptColorMap = {};
    departments.forEach((dept, index) => {
        deptColorMap[dept] = departmentColorPalette[index % departmentColorPalette.length];
    });
    return deptColorMap;
};

const CustomEventTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const department = payload[0].payload.department;
        const eventCount = payload[0].value;
        return (
            <div className="bg-white border rounded-lg shadow-md p-3 text-sm">
                <p className="font-bold text-gray-800">Class: {label}</p>
                <p className="text-gray-600 mb-1">Department: {department}</p>
                <p className="mt-1" style={{ color: payload[0].fill }}>
                    Total Events: <span className="font-semibold">{eventCount}</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function EventCountBarChart({ data = [] }) {
    // 1. Process API Data
    // API returns: { className, department, count }
    // Chart expects: { name, department, events_count }
    const formattedData = data.map(item => ({
        name: item.className,
        department: item.department || "Unknown",
        events_count: item.count
    }));

    // 2. Color Logic
    const deptNames = [...new Set(formattedData.map((d) => d.department))];
    const deptColorMap = getDepartmentColors(deptNames);

    // 3. Dynamic Width
    const dynamicWidth = Math.max(900, formattedData.length * 35);

    // Calc max for Y-Axis domain
    const maxEvents = formattedData.reduce((max, item) => Math.max(max, item.events_count), 0);
    const yAxisDomain = [0, maxEvents < 5 ? 5 : maxEvents + 2];

    if (formattedData.length === 0) {
        return (
            <div className="w-full h-[300px] bg-white p-4 rounded-xl shadow flex items-center justify-center text-gray-500">
                No event data available for this selection.
            </div>
        );
    }

    return (
        <div className="w-full md:h-[600px] h-[700px] bg-white p-4 rounded-xl shadow overflow-hidden">
            <h2 className="text-xl font-semibold mb-4">Event Counts by Class 📊</h2>

            <div className="w-full overflow-x-auto hide-scrollbar" style={{ height: "420px" }}>
                <div style={{ minWidth: dynamicWidth, height: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            barGap={0}
                            margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
                            barCategoryGap="40%"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={90}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis domain={yAxisDomain} allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomEventTooltip />} />

                            <Bar dataKey="events_count" name="Events Count" radius={[5, 5, 0, 0]} barSize={25}>
                                {formattedData.map((entry, i) => (
                                    <Cell key={`event-cell-${i}`} fill={deptColorMap[entry.department] || "#888"} />
                                ))}
                                <LabelList dataKey="events_count" position="top" formatter={(v) => v} style={{ fill: '#000000', fontWeight: 'bold', fontSize: 11 }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <hr className="mb-2" />

            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 justify-center">
                <span className="font-bold w-full text-center text-sm mb-2">Department Color Key:</span>
                {deptNames.map((dept) => (
                    <div key={dept} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded shadow-md" style={{ backgroundColor: deptColorMap[dept] }}></div>
                        <span className="text-sm">{dept}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}