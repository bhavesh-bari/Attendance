"use client";
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    LabelList,
} from "recharts";

// --------------------------------------------------
// 🎨 FIXED COLOR PALETTE (Supports unlimited departments)
// --------------------------------------------------
const departmentColorPalette = [
    "#1E90FF", // Blue
    "#28A745", // Green
    "#FF8C00", // Orange
    "#8A2BE2", // Purple
    "#DC143C", // Red
    "#20B2AA", // Teal
    "#FF1493", // Pink
    "#6A5ACD", // Indigo
    "#708090", // Slate
    "#A0522D", // Brown
];

// Assign consistent colors to departments (using the base color)
const getDepartmentColors = (departments) => {
    const deptColorMap = {};
    departments.forEach((dept, index) => {
        // We only need the base/dark color for the single bar
        deptColorMap[dept] = departmentColorPalette[index % departmentColorPalette.length];
    });
    return deptColorMap;
};

// Custom Tooltip for Events Count
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


export default function EventCountBarChart() {
    // 🔹 NEW DATA STRUCTURE FOR EVENT COUNTS
    const eventDepartmentData = [
        {
            department: "Computer Science",
            classes: [
                { name: "CS101", events_count: 5 },
                { name: "CS102", events_count: 8 },
                { name: "CS201", events_count: 12 },
                { name: "CS202", events_count: 7 },
                { name: "CS301", events_count: 15 },
                { name: "CS302", events_count: 9 },
                { name: "CS401", events_count: 6 },
                { name: "CS402", events_count: 10 },
            ],
        },
        {
            department: "Mechanical Engineering",
            classes: [
                { name: "ME101", events_count: 4 },
                { name: "ME202", events_count: 11 },
                { name: "ME301", events_count: 14 },
                { name: "ME302", events_count: 5 },
                { name: "ME401", events_count: 10 },
                { name: "ME402", events_count: 7 },
                { name: "ME501", events_count: 6 },
            ],
        },
        {
            department: "Electrical Engineering",
            classes: [
                { name: "EE101", events_count: 9 },
                { name: "EE102", events_count: 8 },
                { name: "EE201", events_count: 13 },
                { name: "EE202", events_count: 6 },
                { name: "EE301", events_count: 16 },
                { name: "EE302", events_count: 10 },
                { name: "EE401", events_count: 9 },
                { name: "EE402", events_count: 11 },
                { name: "EE501", events_count: 15 },
                { name: "EE502", events_count: 7 },
            ],
        },
        {
            department: "Civil Engineering",
            classes: [
                { name: "CE101", events_count: 5 },
                { name: "CE201", events_count: 8 },
                { name: "CE301", events_count: 10 },
                { name: "CE401", events_count: 12 },
                { name: "CE501", events_count: 7 },
            ],
        },
        {
            department: "Physics",
            classes: [
                { name: "PHY101", events_count: 11 },
                { name: "PHY102", events_count: 9 },
                { name: "PHY201", events_count: 14 },
                { name: "PHY202", events_count: 8 },
                { name: "PHY301", events_count: 12 },
                { name: "PHY302", events_count: 10 },
            ],
        },
        {
            department: "Chemistry",
            classes: [
                { name: "CHM101", events_count: 9 },
                { name: "CHM102", events_count: 6 },
                { name: "CHM201", events_count: 10 },
                { name: "CHM202", events_count: 13 },
                { name: "CHM301", events_count: 8 },
                { name: "CHM302", events_count: 5 },
                { name: "CHM401", events_count: 7 },
                { name: "CHM402", events_count: 11 },
                { name: "CHM501", events_count: 9 },
            ],
        },
        {
            department: "Mathematics",
            classes: [
                { name: "MTH101", events_count: 10 },
                { name: "MTH102", events_count: 12 },
                { name: "MTH201", events_count: 15 },
                { name: "MTH202", events_count: 7 },
                { name: "MTH301", events_count: 16 },
                { name: "MTH302", events_count: 9 },
                { name: "MTH401", events_count: 11 },
                { name: "MTH402", events_count: 13 },
            ],
        },
    ];

    // Flatten the data
    const flatData = eventDepartmentData.flatMap((dept) =>
        dept.classes.map((cls) => ({
            ...cls,
            department: dept.department,
        }))
    );

    // Collect department names
    const deptNames = eventDepartmentData.map((d) => d.department);
    const deptColorMap = getDepartmentColors(deptNames);

    // Dynamic width logic for scrollable chart (Adjusted factor for single bar)
    const dynamicWidth = Math.max(900, flatData.length * 35);

    return (
        <div className="w-full h-[650px] bg-white p-4 rounded-xl shadow overflow-hidden">
            <h2 className="text-xl font-semibold mb-4">Event Counts by Class 📊</h2>

            {/* Scrollable Chart Container */}
            <div className="w-full overflow-x-auto hide-scrollbar" style={{ height: "480px" }}>
                <div style={{ minWidth: dynamicWidth, height: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={flatData}
                            // Using single bar, so barGap should be 0 or small
                            barGap={0}
                            margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
                            // Increased gap for spacing between classes
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
                            {/* Y-Axis for Event Count (Max is around 16 based on mock data) */}
                            <YAxis
                                domain={[0, 20]}
                                tick={{ fontSize: 12 }}
                            />
                            {/* Custom Tooltip to show count */}
                            <Tooltip content={<CustomEventTooltip />} />

                            {/* SINGLE BAR FOR EVENT COUNT */}
                            <Bar
                                dataKey="events_count"
                                name="Events Count"
                                radius={[5, 5, 0, 0]}
                                barSize={25}
                            >
                                {flatData.map((entry, i) => (
                                    <Cell
                                        key={`event-cell-${i}`}
                                        // Use the base department color for the fill
                                        fill={deptColorMap[entry.department]}
                                    />
                                ))}
                                {/* Label List for Count */}
                                <LabelList
                                    dataKey="events_count"
                                    position="top"
                                    // No formatter needed, just display the count
                                    formatter={(v) => v}
                                    style={{ fill: '#000000', fontWeight: 'bold', fontSize: 11 }} // Black text
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <hr className="my-4" />

            {/* LEGEND FOR DEPARTMENTS */}
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 justify-center">
                <span className="font-bold w-full text-center text-sm mb-2">Department Color Key:</span>
                {deptNames.map((dept) => (
                    <div key={dept} className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded shadow-md"
                            style={{
                                // Use the single color
                                backgroundColor: deptColorMap[dept],
                            }}
                        ></div>
                        <span className="text-sm">{dept}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}